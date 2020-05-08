
var SOCKETS = 10;

//go
let countGo = 0;
let sockets = []
function gosockets() {
    var ioClient = require('socket.io-client')
    for (let i = 0; i < SOCKETS; i++) {
        let socket = ioClient.connect('http://localhost:5007');
        socket.once('connect', function (args) {
            console.log("connect go")
        });
        socket.on('event:notification', function (data) {
            console.log("event:notification #" + i, ++countGo, data)
        });

        socket.on('event:message', function (data) {
            console.log("event:message #" + i, data)
        });
        socket.on('disconnect', function () { });
        sockets.push(socket)
    }
    setTimeout(() => {
        sockets.forEach((socket) => {
            console.log("emit")
            socket.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
        })
    }, 100)
}

let countNode = 0
//node
function nodesockets() {
    var ioClient = require('socket.io-client')
    for (let i = 0; i < SOCKETS; i++) {
        let socket = ioClient.connect('http://localhost:5005');
        ((socket) => {
            socket.once('connect', function (args) {
                console.log("connect node")
                socket.emit("Connect new user", { userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" })
            });

            socket.on('send message', function (data) {
                console.log("send message #" + i, data)
            });

            socket.on('new message', function (data) {
                console.log("new message #" + i, ++countNode, data)
            });

            socket.on('disconnect', function () { });
        })(socket)
    }
}

//nodesockets()
gosockets()
