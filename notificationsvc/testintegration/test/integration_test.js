let chai = require('chai');
let tags = require('mocha-tags');
let chaiHttp = require('chai-http')
let gosockets = require("./socket");

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
        it('/api/notify should return 200', async () => {
            const response = await chai.request(app).post('/api.notify')
            chai.assert(response.status == 200, "invalid status expected 200")
        })
    })

tags("notificationsvc", "socket")
    .describe("notification", () => {
        it('socket should receive connection message', (done) => {
            cb = (data) => {
                chai.assert(data != undefined, "failed to receive socket connection response")
                done()
            }
            gosockets(cb)
        })
        
    })
