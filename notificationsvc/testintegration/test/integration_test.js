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
                if (once) {
                    chai.assert(data != undefined, "failed to receive socket connection response")
                    chai.assert(data.showNotificationToUser == false, "model_save_complete_failed property- showNotificationToUser")
                    chai.assert(data.actionType == "addContext", "model_save_complete_failed property- addContext")
                    chai.assert(data.context.appInstanceId == "app-entity-manage-component-rs54p0nx9ZxECmnz5x", "model_save_complete_failed property- context.appInstanceId")
                    chai.assert(data.context.id == "ersgi6whO7jv0G3", "model_save_complete_failed property- context.id")
                    chai.assert(data.context.type == "uomLengthWithoutFormula3", "model_save_complete_failed property- context.type")
                    chai.assert(data.context.dataIndex == "entityData", "model_save_complete_failed property- context.dataIndex")
                    chai.assert(data.id == "JUM4h6OrSO-Cul6YnIcvSw", "model_save_complete_failed property- id")
                    chai.assert(data.timeStamp == "2017-06-15T08:46:29.689Z", "model_save_complete_failed property- timestamp")
                    chai.assert(data.source == "ui", "model_save_complete_failed property- source")
                    chai.assert(data.userId == "rdwadmin@riversand.com_user", "model_save_complete_failed property- userId")
                    chai.assert(data.connectionId == "", "model_save_complete_failed property- connectionId")
                    chai.assert(data.operation == "MODEL_EXPORT", "model_save_complete_failed property- operation")
                    chai.assert(data.requestStatus == "Completed", "model_save_complete_failed property- requestStatus")
                    chai.assert(data.taskId == "ba8d3752-5e8c-433e-bc98-1d64193888fb", "model_save_complete_failed property- taskId")
                    chai.assert(data.taskType == "ENTITY_IMPORT", "model_save_complete_failed property- taskType")
                    chai.assert(data.requestId == "ceb62795-46c9-4138-b53e-9f491756a204", "model_save_complete_failed property- requestId")
                    chai.assert(data.action == 11, "model_save_complete_failed property- action")
                    chai.assert(data.dataIndex == "entityData", "model_save_complete_failed property- dataIndex")
                    //chai.assert(data.description == "System Manage Complete", "model_save_complete_failed property- description")
                    chai.assert(data.status == "success", "model_save_complete_failed property- status")
                    chai.assert(data.tenantId == "rdwengg-az-dev2", "model_save_complete_failed property- tenantId")
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
