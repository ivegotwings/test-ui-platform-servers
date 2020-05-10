const commandLineArgs = require('command-line-args')
const optionDefinitions = [
    { name: 'log', alias: 'l', type: Boolean },
    { name: 'random', alias: 'r', type: Boolean }
]
const options = commandLineArgs(optionDefinitions)
var SOCKETS = 10;

//go
let countGo = 0;
let sockets = []
function gosockets() {
    var ioClient = require('socket.io-client')
    for (let i = 0; i < SOCKETS; i++) {
        let socket = ioClient.connect('http://localhost:5007', {
            reconnection: true,
            autoConnect: true,
            reconnectionDelayMax: 1000,
            reconnectionAttempts: Infinity,
            transports: ["websocket", "polling"]
        });
        ((socket, i) => {
            socket.once('connect', function (args) {
                console.log("connect go")
            });
            socket.on('event:notification', function (data) {
                if (options.log) {
                    if (options.random) {
                        if (Math.random() > 0.95) {
                            console.log("event:notification #" + i, ++countGo)
                        }
                    } else {
                        console.log("event:notification #" + i, ++countGo)
                    }
                }
                if (options.log) {

                }
            });

            socket.on('event:message', function (data) {
                console.log("event:message #" + i, data)
            });
            socket.on('disconnect', function () { });
        })(socket, i)
        sockets.push(socket)
    }
    setTimeout(() => {
        sockets.forEach((socket) => {
            socket.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
        })
    }, 1000)
}

let countNode = 0

function nodesockets() {
    var ioClient = require('socket.io-client')
    for (let i = 0; i < SOCKETS; i++) {
        let socket = ioClient.connect('http://localhost:5005', {
            reconnection: true,
            autoConnect: true,
            reconnectionDelayMax: 1000,
            reconnectionAttempts: Infinity,
            transports: ["websocket", "polling"]
        });
        ((socket, i) => {
            socket.once('connect', function (args) {
                console.log("connect node")
                socket.emit("Connect new user", { userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" })
            });
            socket.on('send message', function (data) {
                console.log("event:notification #" + i, ++countGo)
            });

            socket.on('new message', function (data) {
                console.log("event:message #" + i, data)
            });
            socket.on('disconnect', function () { });
        })(socket, i)
        sockets.push(socket)
    }
    setTimeout(() => {
        sockets.forEach((socket) => {
            socket.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
        })
    }, 1000)
}

//nodesockets()
gosockets()
