package state

import (
	"errors"

	"ui-platform-servers/notificationsvc/utils"

	"github.com/garyburd/redigo/redis"
)

func Connect(opts map[string]string) (redis.Conn, error) {
	var conn redis.Conn
	var ok bool
	var err error
	var host, port string
	host, ok = opts["host"]
	if !ok {
		host = "127.0.0.1"
	}
	port, ok = opts["port"]
	if !ok {
		port = "6379"
	}
	conn, err = redis.Dial("tcp", host+":"+port)
	if err != nil {
		utils.PrintError("state- unable to connect to redis")
		return nil, errors.New("state- unable to connect to redis")
	}
	return conn, nil
}

// func Conn() *redis.Conn {
// 	return &conn
// }
