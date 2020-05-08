
let SOCKETS = 1;
let countGo = 0;

function gosockets(cb) {
    var ioClient = require('socket.io-client')
    let socket = ioClient.connect('http://localhost:5007');
    for (let i = 0; i < SOCKETS; i++) {
        ((socket) => {
            socket.once('connect', function (args) {
                console.log("connect go")
                socket.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
                cb("connected")
            });

            socket.on('event:notification', function (data) {
                console.log("event:notification #" + i, ++countGo)
                cb("notification", data, countGo)
            });

            socket.on('event:message', function (data) {
                console.log("event:message #" + i, data)
                cb("message ", data)
            });
        })(socket)

        socket.on('disconnect', function () { });
    }

}

module.exports = gosockets

// let countNode = 0
// //node
// function nodesockets() {
//     var ioClient = require('socket.io-client')
//     for (let i = 0; i < SOCKETS; i++) {
//         let socket = ioClient.connect('http://localhost:5005');
//         ((socket) => {
//             socket.once('connect', function (args) {
//                 console.log("connect node")
//                 socket.emit("Connect new user", { userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" })
//             });

//             socket.on('send message', function (data) {
//                 console.log("send message #" + i, data)
//             });

//             socket.on('new message', function (data) {
//                 console.log("new message #" + i, ++countNode, data)
//             });

//             socket.on('disconnect', function () { });
//         })(socket)
//     }
// }

//nodesockets()
//gosockets()
