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
let socket3 = ioClient.connect('http://localhost:5007');
let socket4 = ioClient.connect('http://localhost:5007');
let socket5 = ioClient.connect('http://localhost:5007');

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
        it('notify should eco valid data', (done) => {
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
                    chai.assert(data.showNotificationToUser == false, "echo_failed property- showNotificationToUser")
                    chai.assert(data.actionType == "addContext", "echo_failed property- addContext")
                    chai.assert(data.context.appInstanceId == "app-entity-manage-component-rs54p0nx9ZxECmnz5x", "echo_failed property- context.appInstanceId")
                    chai.assert(data.context.id == "ersgi6whO7jv0G3", "echo_failed property- context.id")
                    chai.assert(data.context.type == "uomLengthWithoutFormula3", "echo_failed property- context.type")
                    chai.assert(data.context.dataIndex == "entityData", "echo_failed property- context.dataIndex")
                    chai.assert(data.id == "JUM4h6OrSO-Cul6YnIcvSw", "echo_failed property- id")
                    chai.assert(data.timeStamp == "2017-06-15T08:46:29.689Z", "echo_failed property- timestamp")
                    chai.assert(data.source == "ui", "echo_failed property- source")
                    chai.assert(data.userId == "rdwadmin@riversand.com_user", "echo_failed property- userId")
                    chai.assert(data.connectionId == "", "echo_failed property- connectionId")
                    chai.assert(data.taskId == "ba8d3752-5e8c-433e-bc98-1d64193888fb", "echo_failed property- taskId")
                    chai.assert(data.requestId == "ceb62795-46c9-4138-b53e-9f491756a204", "echo_failed property- requestId")
                    chai.assert(data.tenantId == "rdwengg-az-dev2", "echo_failed property- tenantId")
                    done();
                    once = false
                }
            });
            socket2.on('event:message', function (data) {
                let payload = require("../testdata/model_save_complete.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })
        it('model_save_complete socket should receive valid data', (done) => {
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
                    //chai.assert(data.description == "System Manage Complete", "model_save_complete_failed property- description")
                    chai.assert(data.taskType == "ENTITY_IMPORT", "model_save_complete_failed property- taskType")
                    chai.assert(data.operation == "MODEL_EXPORT", "model_save_complete_failed property- operation")
                    chai.assert(data.requestStatus == "success", "model_save_complete_failed property- requestStatus")
                    chai.assert(data.dataIndex == "entityModel", "model_save_complete_failed property- dataIndex")
                    chai.assert(data.action == 17, "model_save_complete_failed property- action")
                    chai.assert(data.status == "success", "model_save_complete_failed property- status")
                    done();
                    once = false
                }
            });
            socket2.on('event:message', function (data) {
                let payload = require("../testdata/model_save_complete.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })
        it('workflow_transition socket should receive valid data', (done) => {
            let once = true;
            socket3.on('disconnect', function () { });
            setTimeout(() => {
                socket3.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
            }, 10)

            socket3.once('connect', async function (args) {
                //console.log("connect")
            });

            socket3.on('event:notification', function (data) {
                if (once) {
                    chai.assert(data != undefined, "failed to receive socket connection response")
                    //chai.assert(data.description == "System Manage Complete", "workflow_transition_failed property- description")
                    chai.assert(data.status == "success", "workflow_transition_failed property- status")
                    chai.assert(data.requestStatus == "success", "workflow_transition_failed property- requestStatus")
                    chai.assert(data.operation == "WorkflowTransition", "workflow_transition_failed property- operation")
                    chai.assert(data.dataIndex == "entityData", "workflow_transition_failed property- dataIndex")
                    chai.assert(data.action == 7, "workflow_transition_failed property- action")
                    done();
                    once = false
                }
            });
            socket3.on('event:message', function (data) {
                let payload = require("../testdata/workflow_transition.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })
        it('workflow_assignment socket should receive valid data', (done) => {
            let once = true;
            socket4.on('disconnect', function () { });
            setTimeout(() => {
                socket4.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
            }, 10)

            socket4.once('connect', async function (args) {
                //console.log("connect")
            });

            socket4.on('event:notification', function (data) {
                if (once) {
                    chai.assert(data != undefined, "failed to receive socket connection response")
                    //chai.assert(data.description == "System Manage Complete", "workflow_assignment_failed property- description")
                    chai.assert(data.status == "success", "workflow_assignment_failed property- status")
                    chai.assert(data.requestStatus == "success", "workflow_assignment_failed property- requestStatus")
                    chai.assert(data.operation == "WorkflowAssignment", "workflow_assignment_failed property- operation")
                    chai.assert(data.dataIndex == "entityData", "workflow_assignment_failed property- dataIndex")
                    chai.assert(data.action == 9, "workflow_assignment_failed property- action")
                    done();
                    once = false
                }
            });
            socket4.on('event:message', function (data) {
                let payload = require("../testdata/workflow_assignment.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })
        it('entity_update socket should receive valid data', (done) => {
            let once = true;
            socket5.on('disconnect', function () { });
            setTimeout(() => {
                socket5.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
            }, 10)

            socket5.once('connect', async function (args) {
                //console.log("connect")
            });

            socket5.on('event:notification', function (data) {
                if (once) {
                    chai.assert(data != undefined, "failed to receive socket connection response")
                    //chai.assert(data.description == "System Manage Complete", "entity_update_failed property- description")
                    chai.assert(data.status == "success", "entity_update_failed property- status")
                    chai.assert(data.requestStatus == "success", "entity_update_failed property- requestStatus")
                    chai.assert(data.operation == "", "entity_update_failed property- operation")
                    chai.assert(data.dataIndex == "entityData", "entity_update_failed property- dataIndex")
                    chai.assert(data.action == 5, "entity_update_failed property- action")
                    done();
                    once = false
                }
            });
            socket5.on('event:message', function (data) {
                let payload = require("../testdata/entity_update.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })
    })
