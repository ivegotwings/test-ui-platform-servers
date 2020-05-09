package connection

import (
	"ui-platform-servers/notificationsvc/cmap_string_socket"
	"ui-platform-servers/notificationsvc/utils"

	"ui-platform-servers/notificationsvc/cmap_string_cmap"

	"github.com/garyburd/redigo/redis"
	socketio "github.com/googollee/go-socket.io"
	uuid "github.com/nu7hatch/gouuid"

	// "github.com/vmihailenco/msgpack"  // screwed up types after decoding
	"encoding/json"
)

type Broadcast struct {
	host   string
	port   string
	pub    redis.PubSubConn
	sub    redis.PubSubConn
	prefix string
	uid    string
	key    string
	remote bool
	rooms  cmap_string_cmap.ConcurrentMap
}

//
// opts: {
//   "host": "127.0.0.1",
//   "port": "6379"
//   "prefix": "socket.io"
// }
func Redis(opts map[string]string) *Broadcast {
	b := Broadcast{
		rooms: cmap_string_cmap.New(),
	}

	var ok bool
	b.host, ok = opts["host"]
	if !ok {
		b.host = "127.0.0.1"
	}
	b.port, ok = opts["port"]
	if !ok {
		b.port = "6379"
	}
	b.prefix, ok = opts["prefix"]
	if !ok {
		b.prefix = "socket.io"
	}

	pub, err := redis.Dial("tcp", b.host+":"+b.port)
	if err != nil {
		//pm2io.Notifier.Error(err)
		panic(err)
	}
	sub, err := redis.Dial("tcp", b.host+":"+b.port)
	if err != nil {
		//pm2io.Notifier.Error(err)
		panic(err)
	}

	b.pub = redis.PubSubConn{Conn: pub}
	b.sub = redis.PubSubConn{Conn: sub}

	uid, err := uuid.NewV4()
	if err != nil {
		utils.Println("", "", "connection.go", "", "error generating uid: "+err.Error(), "", nil)
		return nil
	}
	b.uid = uid.String()
	b.key = b.prefix + "#" + b.uid

	b.remote = false

	b.sub.PSubscribe(b.prefix + "#*")

	// This goroutine receives and prints pushed notifications from the server.
	// The goroutine exits when there is an error.
	go func() {
		for {
			switch n := b.sub.Receive().(type) {
			case redis.Message:
				utils.PrintDebug("Redis Message: %s %s\n", n.Channel, n.Data)
			case redis.PMessage:
				utils.PrintDebug("PMessage: %s %s %s\n", n.Pattern, n.Channel, n.Data)
				b.onmessage(n.Channel, n.Data)
			case redis.Subscription:
				utils.PrintDebug("Subscription: %s %s %d\n", n.Kind, n.Channel, n.Count)
				if n.Count == 0 {
					return
				}
			case error:
				utils.PrintError("error: %v\n " + n.Error())
				return
			}
		}
	}()

	return &b
}

func (b Broadcast) onmessage(channel string, data []byte) error {
	//allow same channel communication
	//pieces := strings.Split(channel, "#")
	//uid := pieces[len(pieces)-1]
	// if b.uid == uid && b.uid != "1" {
	// 	utils.PrintError("ignore same uid")
	// 	return nil
	// }

	var out map[string][]interface{}
	err := json.Unmarshal(data, &out)
	if err != nil {
		utils.PrintError("error decoding data")
		return nil
	}

	args := out["args"]
	opts := out["opts"]
	ignore, ok := opts[0].(socketio.Conn)
	if !ok {
		utils.PrintDebug("ignore is not a socket %+v\n", ignore)
		ignore = nil
	}
	room, ok := opts[1].(string)
	if !ok {
		utils.PrintDebug("room is not a string %s", room)
		room = ""
	}
	message, ok := opts[2].(string)
	if !ok {
		utils.PrintDebug("message is not a string %s", message)
		message = ""
	}

	b.remote = true
	for _, arg := range args {
		utils.PrintDebug("Redis PUBSUB message args- %d\n", arg)
	}
	b.SendSocket(ignore, room, message, args...)
	return nil
}

func (b Broadcast) Join(room string, socket socketio.Conn) error {
	sockets, ok := b.rooms.Get(room)
	if !ok {
		sockets = cmap_string_socket.New()
	}
	_socket := utils.SocketWithLock{
		Socket: &socket,
	}
	s := *_socket.Socket
	s.Join(room)
	sockets.Set(socket.ID(), &_socket)
	b.rooms.Set(room, sockets)

	return nil
}

func (b Broadcast) Leave(socket socketio.Conn) {
	var sockets cmap_string_socket.ConcurrentMap
	var ok bool
	var room string
	if room == "" {
		for t := range b.rooms.Iter() {
			sockets, ok = b.rooms.Get(t.Key)
			if sockets.Has(socket.ID()) && ok {
				room = t.Key
				utils.PrintDebug("removing socket with id from room %s %s", socket.ID(), room)
				sockets.Remove(socket.ID())
				if sockets.IsEmpty() {
					b.rooms.Remove(room)
				} else {
					b.rooms.Set(room, sockets)
				}
			}
		}
	}
}

// Same as Broadcast
func (b Broadcast) Send(ignore socketio.Conn, room, message string, args ...interface{}) error {
	opts := make([]interface{}, 3)
	opts[0] = ignore
	opts[1] = room
	opts[2] = message
	in := map[string][]interface{}{
		"args": args,
		"opts": opts,
	}

	buf, err := json.Marshal(in)
	_ = err

	if !b.remote {
		b.pub.Conn.Do("PUBLISH", b.key, buf)
	}
	b.remote = false
	return nil
}
func (b Broadcast) SendSocket(ignore socketio.Conn, room, message string, args ...interface{}) error {
	_sockets, ok := b.rooms.Get(room)
	if ok {
		for item := range _sockets.Iter() {
			id := item.Key

			_socket := item.Val
			if ignore != nil && ignore.ID() == id {
				continue
			}

			go func() {
				s := *_socket.Socket
				_socket.Lock()
				s.Emit(message, args...)
				defer _socket.Unlock()
				defer func() {
					if err := recover(); err != nil {
						utils.PrintError(err.(string))
					}
				}()
			}()
		}
	} else {
		utils.PrintError("error sending message to room: " + room)
	}
	return nil
}
