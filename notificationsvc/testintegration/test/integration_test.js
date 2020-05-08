let chai = require('chai');
let tags = require('mocha-tags');
let chaiHttp = require('chai-http')

chai.use(chaiHttp)
let app = "http://localhost:5007"

tags("notificationsvc", "api")
    .describe("healthcheck", () => {
        it('/ should return 200 OK', async () => {
            const response = await chai.request(app).get('/')
            chai.assert(response.status == 200, "invalid status expected 200")
            chai.assert(response.text == "OK", "invalid text expected OK")
        })
        it('/api/notify should return 200', async () => {
            const response = await chai.request(app).post('/api.notify')
            chai.assert(response.status == 200, "invalid status expected 200")
        })
    })
var ioClient = require('socket.io-client')
let socket1 = ioClient.connect('http://localhost:5007');
let socket2 = ioClient.connect('http://localhost:5007');

tags("notificationsvc", "socket")
    .describe("notification", () => {
        it('socket should receive connection message', (done) => {
            let once = true
            setTimeout(() => {
                socket1.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
            }, 10)

            socket1.on('disconnect', function () { });
            socket1.once('connect', function (args) {
                // console.log("connect")
            });
            socket1.on('event:message', function (data) {
                chai.assert(data != undefined, "failed to receive socket connection response")
                if (once) {
                    done()
                    once = false
                }
            });
        })
        it('model-save-complete socket should receive valid data', (done) => {
            let once = true;
            socket2.on('disconnect', function () { });
            setTimeout(() => {
                socket2.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
            }, 10)

            socket2.once('connect', async function (args) {
                //console.log("connect")
            });

            socket2.on('event:notification', function (data) {
                chai.assert(data != undefined, "failed to receive socket connection response")
                if (once) {
                    done();
                    once = false
                }
            });
            socket2.on('event:message', function (data) {
                let payload = require("../testdata/model-save-complete.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })
    })
