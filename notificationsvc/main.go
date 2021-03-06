package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"runtime"
	"strconv"
	"time"

	"ui-platform-servers/notificationsvc/connection"
	"ui-platform-servers/notificationsvc/moduleversion"
	"ui-platform-servers/notificationsvc/notification"
	"ui-platform-servers/notificationsvc/state"
	"ui-platform-servers/notificationsvc/utils"

	socketio "github.com/googollee/go-socket.io"
	"go.elastic.co/apm/module/apmhttp"
)

type Config struct {
	Redis struct {
		Host string
		Port string
	}
}

func LoadConfiguration(file string) Config {
	var config Config
	configFile, err := os.Open(file)
	defer configFile.Close()
	byteValue, _ := ioutil.ReadAll(configFile)
	if err != nil {
		utils.PrintInfo(err.Error())
	}
	_ = json.Unmarshal([]byte(byteValue), &config)
	return config
}

func baseRouter(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Server", "A Go Web Server")
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprintf(w, "OK")
	w.WriteHeader(http.StatusOK)
}

var redisBroadCastAdaptor connection.Broadcast

func main() {
	//log.SetOutput(ioutil.Discard)
	//log.SetOutput(os.Stderr)

	f, err := os.OpenFile("/var/lib/rs/dataplatform.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()

	log.SetOutput(f)
	runtime.GOMAXPROCS(4)

	//Create PM2 connector
	//pm2 link sf7mwo5yxfdawcm xauiz97m6zsza77
	// pm2 := pm2io.Pm2Io{
	// 	Config: &structures.Config{
	// 		PublicKey:  "xauiz97m6zsza77",            // define the public key given in the dashboard
	// 		PrivateKey: "sf7mwo5yxfdawcm",            // define the private key given in the dashboard
	// 		Name:       "Golang Notification Server", // define an application name
	// 	},
	// }
	// pm2.Start()

	utils.PrintInfo("GOMAXPROCS: " + strconv.Itoa(runtime.GOMAXPROCS(0)))
	server, err := socketio.NewServer(nil)
	if err != nil {
		utils.PrintError("Failed to create socket server: " + err.Error())
		log.Fatal(err)
	}
	var configfilename string = "config_" + os.Getenv("ENV") + ".json"
	utils.PrintDebug("redis config file" + configfilename)
	var config Config = LoadConfiguration(configfilename)
	b, err := json.Marshal(config)
	utils.PrintInfo("Redis Config: " + string(b))
	//pre load the map once
	err = moduleversion.LoadDomainMap()
	if err != nil {
		utils.PrintError("error loading moduledoaminmap.json " + err.Error())
	}

	opts := make(map[string]string)
	opts["host"] = config.Redis.Host
	opts["port"] = config.Redis.Port
	//notifiy channel
	redisBroadCastAdaptor = *connection.Redis(opts)
	//state channel
	err = state.Connect(opts)
	if err != nil {
		//pm2io.Notifier.Error(err)
		panic(err)
	}
	notification.SetRedisBroadCastAdaptor(&redisBroadCastAdaptor)

	server.OnConnect("", func(so socketio.Conn) error {
		so.SetContext("")
		err := redisBroadCastAdaptor.Join("all-sockets", so)
		if err != nil {
			utils.PrintInfo("Redis BroadCastManager- Failure to connect " + err.Error())
		}
		utils.PrintDebug("connected socketId: " + so.ID())

		return nil
	})

	server.OnDisconnect("", func(so socketio.Conn, reason string) {
		utils.PrintDebug("disconnected socket reason- %s", reason)
		redisBroadCastAdaptor.Leave(so)
	})

	server.OnError("error", func(so socketio.Conn, err error) {
		utils.PrintError("error: " + err.Error())
	})

	server.OnEvent("/", "event:adduser", func(so socketio.Conn, msg string) {
		var _userInfo interface{}
		err := json.Unmarshal([]byte(msg), &_userInfo)
		if err != nil {
			utils.PrintError("error processing event:adduser")
		} else {
			userInfo, ok := _userInfo.(map[string]interface{})
			if ok {
				//join user room
				user_room := "socket_conn_room_tenant_" + userInfo["tenantId"].(string) + "_user_" + userInfo["userId"].(string)
				err = redisBroadCastAdaptor.Join(user_room, so)
				//join tenant room
				tenant_room := "socket_conn_room_tenant_" + userInfo["tenantId"].(string)
				err = redisBroadCastAdaptor.Join(tenant_room, so)
				if err != nil {
					utils.PrintError("Redis BroadCastManager- Failure to connect: " + err.Error())
				} else {
					utils.PrintDebug("adding new user to rooms: " + user_room + tenant_room)
					so.Emit("event:message", _userInfo)
				}
			}
		}

	})

	go server.Serve()
	defer server.Close()

	http.Handle("/socket.io/", server)
	http.Handle("/", http.HandlerFunc(baseRouter))
	notificationHandler := notification.NotificationHandler{}
	tracedHandler := apmhttp.Wrap(http.HandlerFunc(notificationHandler.Notify))
	http.Handle("/api/notify", tracedHandler)
	client := &http.Server{
		ReadTimeout:  3 * time.Second,
		WriteTimeout: 3 * time.Second,
		IdleTimeout:  3 * time.Millisecond,
		Handler:      nil,
		Addr:         ":5007",
	}

	utils.PrintInfo("Serving at localhost:5007...")
	log.Fatal(client.ListenAndServe())
}
