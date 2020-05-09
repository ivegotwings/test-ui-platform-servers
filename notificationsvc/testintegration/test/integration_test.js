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
let socket6 = ioClient.connect('http://localhost:5007');
let socket7 = ioClient.connect('http://localhost:5007');
let socket8 = ioClient.connect('http://localhost:5007');
let socket9 = ioClient.connect('http://localhost:5007');
let socket10 = ioClient.connect('http://localhost:5007');
let socket11 = ioClient.connect('http://localhost:5007');


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
        it('model_import socket should receive valid data', (done) => {
            let once = true;
            socket6.on('disconnect', function () { });
            setTimeout(() => {
                socket6.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
            }, 10)

            socket6.once('connect', async function (args) {
                //console.log("connect")
            });

            socket6.on('event:notification', function (data) {
                if (once) {
                    chai.assert(data != undefined, "failed to receive socket connection response")
                    //chai.assert(data.description == "System Manage Complete", "model_import_failed property- description")
                    chai.assert(data.status == "success", "model_import_failed property- status")
                    chai.assert(data.requestStatus == "Completed", "model_import_failed property- requestStatus")
                    chai.assert(data.operation == "MODEL_IMPORT", "model_import_failed property- operation")
                    chai.assert(data.dataIndex == "entityModel", "model_import_failed property- dataIndex")
                    chai.assert(data.action == 15, "model_import_failed property- action")
                    done();
                    once = false
                }
            });
            socket6.on('event:message', function (data) {
                let payload = require("../testdata/model_import.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })
        it('business_condition_save socket should receive valid data', (done) => {
            let once = true;
            socket7.on('disconnect', function () { });
            setTimeout(() => {
                socket7.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
            }, 10)

            socket7.once('connect', async function (args) {
                //console.log("connect")
            });

            socket7.on('event:notification', function (data) {
                if (once) {
                    chai.assert(data != undefined, "failed to receive socket connection response")
                    //chai.assert(data.description == "System Manage Complete", "business_condition_save_failed property- description")
                    chai.assert(data.status == "success", "business_condition_save_failed property- status")
                    chai.assert(data.requestStatus == "success", "business_condition_save_failed property- requestStatus")
                    chai.assert(data.operation == "BusinessCondition", "business_condition_save_failed property- operation")
                    chai.assert(data.dataIndex == "entityData", "business_condition_save_failed property- dataIndex")
                    chai.assert(data.action == 13, "business_condition_save_failed property- action")
                    done();
                    once = false
                }
            });
            socket7.on('event:message', function (data) {
                let payload = require("../testdata/business_condition_save.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })
        it('config_save socket should receive valid data', (done) => {
            let once = true; socket8.on('disconnect', function () { });
            setTimeout(() => {
                socket8.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
            }, 10)

            socket8.once('connect', async function (args) {
                //console.log("connect")
            });

            socket8.on('event:notification', function (data) {
                if (once) {
                    chai.assert(data != undefined, "failed to receive socket connection response")
                    //chai.assert(data.description == "System Manage Complete", "config_save_failed property- description")
                    chai.assert(data.status == "success", "config_save_failed property- status")
                    chai.assert(data.requestStatus == "success", "config_save_failed property- requestStatus")
                    chai.assert(data.operation == "", "config_save_failed property- operation")
                    chai.assert(data.dataIndex == "config", "config_save_failed property- dataIndex")
                    chai.assert(data.action == 22, "config_save_failed property- action")
                    done(); once = false
                }
            });
            socket8.on('event:message', function (data) {
                let payload = require("../testdata/config_save.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })
        it('model_export socket should receive valid data', (done) => {
            let once = true; socket8.on('disconnect', function () { });
            setTimeout(() => {
                socket9.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
            }, 10)

            socket9.once('connect', async function (args) {
                //console.log("connect")
            });

            socket9.on('event:notification', function (data) {
                if (once) {
                    chai.assert(data != undefined, "failed to receive socket connection response")
                    //chai.assert(data.description == "System Manage Complete", "model_export_failed property- description")
                    chai.assert(data.status == "success", "model_export_failed property- status")
                    chai.assert(data.requestStatus == "Completed", "model_export_failed property- requestStatus")
                    chai.assert(data.operation == "MODEL_EXPORT", "model_export_failed property- operation")
                    chai.assert(data.dataIndex == "entityData", "model_export_failed property- dataIndex")
                    chai.assert(data.action == 19, "model_export_failed property- action")
                    done(); once = false
                }
            });
            socket9.on('event:message', function (data) {
                let payload = require("../testdata/model_export.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })
        it('entity_export socket should receive valid data', (done) => {
            let once = true; socket8.on('disconnect', function () { });
            setTimeout(() => {
                socket10.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
            }, 10)

            socket10.once('connect', async function (args) {
                //console.log("connect")
            });

            socket10.on('event:notification', function (data) {
                if (once) {
                    chai.assert(data != undefined, "failed to receive socket connection response")
                    //chai.assert(data.description == "System Manage Complete", "entity_export_failed property- description")
                    chai.assert(data.status == "success", "entity_export_failed property- status")
                    chai.assert(data.requestStatus == "Completed", "entity_export_failed property- requestStatus")
                    chai.assert(data.operation == "ENTITY_EXPORT", "entity_export_failed property- operation")
                    chai.assert(data.dataIndex == "entityData", "entity_export_failed property- dataIndex")
                    chai.assert(data.action == 19, "entity_export_failed property- action")
                    done(); once = false
                }
            });
            socket10.on('event:message', function (data) {
                let payload = require("../testdata/entity_export.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })
        it('wf_transition socket should receive valid data', (done) => {
            let once = true; socket8.on('disconnect', function () { });
            setTimeout(() => {
                socket11.emit("event:adduser", JSON.stringify({ userId: "rdwadmin@riversand.com_user", tenantId: "rdwengg-az-dev2" }))
            }, 10)

            socket11.once('connect', async function (args) {
                //console.log("connect")
            });

            socket11.on('event:notification', function (data) {
                if (once) {
                    chai.assert(data != undefined, "failed to receive socket connection response")
                    //chai.assert(data.description == "System Manage Complete", "wf_transition_failed property- description")
                    chai.assert(data.status == "success", "wf_transition_failed property- status")
                    chai.assert(data.requestStatus == "Completed", "wf_transition_failed property- requestStatus")
                    chai.assert(data.dataIndex == "entityData", "wf_transition_failed property- dataIndex")
                    chai.assert(data.action == 21, "wf_transition_failed property- action")
                    chai.assert(data.taskType == "transitionWorkflow-multi-query", "wf_transition_failed property- action")
                    done(); once = false
                }
            });
            socket11.on('event:message', function (data) {
                let payload = require("../testdata/wf_transition.json")
                chai.request(app)
                    .post('/api/notify')
                    .set('Content-Type', 'application/json')
                    .send(payload)
                    .end(function (err, res) { })
            });
        })

    })
