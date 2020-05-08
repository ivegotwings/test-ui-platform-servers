package utils

import (
	"log"
	"os"
	"sync"

	socketio "github.com/googollee/go-socket.io"
	"github.com/ivegotwings/mdm-ui-go/executioncontext"
)

type SocketWithLock struct {
	Socket *socketio.Conn
	sync.RWMutex
}

var ctx executioncontext.Context

func Contains(arr []string, str string) bool {
	for _, a := range arr {
		if a == str {
			return true
		}
	}
	return false
}

func PrintDebug(format string, messagef ...interface{}) {
	if os.Getenv("LOG_LEVEL") == "DEBUG" {
		Println("debug", "", "", format, messagef...)
	}
}

func PrintInfo(message string) {
	var v []interface{}
	Println("info", "", "", "", message, "%s", v)
}

func SetExecutionContext(context executioncontext.Context) {
	ctx = context
}

func Println(loglevel string, calleeServiceName string, message string, format string, messagef ...interface{}) {
	// "requestId", "guid", "tenantId", "callerServiceName", "calleeServiceName",
	// "relatedRequestId", "groupRequestId", "taskId", "userId", "entityId",
	// "objectType", "className", "method", "newTimestamp", "action",
	// "inclusiveTime", "messageCode", "instanceId", "logMessage"
	tenantId := ctx.TenantId
	userId := ctx.UserId
	var messageTemplate string = `[` + loglevel + `] [] [] [` + tenantId + `] [Go-Notification] [` + calleeServiceName + `] [] [] [] [` + userId + `] [] [] [] [] [] [] [] [] [] [` + message + `]`
	switch loglevel {
	case "panic":
		log.Panic(messageTemplate)
		break
	case "fatal":
		log.Fatal(messageTemplate)
	case "info":
		log.Println(messageTemplate)
		break
	case "debug":
		log.Printf(`[`+loglevel+`] [] [] [`+tenantId+`] [Go-Notification] [`+calleeServiceName+`] [] [] [] [`+userId+`] [] [] [] [] [] [] [] [] [] [`+format+`]`, messagef...)
	}
}
