'use strict'

const express = require("express");
const morgan = require('morgan');
const Mutex = require('async-mutex').Mutex;
const { body, validationResult } = require('express-validator');

const dao = require("./dao.js"); 
const test = require('./prepare_db.js');
const Service = require('./service.js')
const Ticket = require('./ticket.js')
const Counter = require('./counter.js')

const app = express()
const lastTicketIdMutex = new Mutex();

// system parameters
const PORT = 3001;
let lastTicketId = null;
let availableServices = null;
let dbpath = "./office_queue.db"

app.use(express.json())
app.use(morgan("combined"))

const APIRoutes= {
    routes: [
        {
            "route": "/api/tickets/:serviceId",
            "action": "GET"
        }, 
        {
            "route": "/api/services",
            "action": "GET"
        }, 
        {
            "route": "/api/services",
            "action": "POST"
        }, 
        {
            "route": "/api/services",
            "action": "PUT"
        }, 
        {
            "route": "/api/services/:serviceId",
            "action": "DELETE"
        }, 
        {
            "route": "/api/counterservices",
            "action": "POST"
        }, 
        {
            "route": "/api/counterservices",
            "action": "DELETE"
        },
    ]
}

const ErrorMsgDb = {
    errors: [{
        "from": "server",
        "msg": "database promise rej"
    }]
}

function createErrorMsg(from, msg) {
    const err = {
        "from" : from,
        "msg" : msg
    }
    return err
}

/* Get a new ticket for the service.serviceId = serviceId 
 * @param none 
 * @route_parameter none 
 * @returns status: 400 for non-existing serviceId, 200 for normal execution, and 503 for db error
 * @returns an errorMsg for 400 or 503. Return the new ticket as json for 200 status code
 */
app.get('/api/tickets/:serviceId', async (req, res) => {
    const serviceId = parseInt(req.params.serviceId, 10)
    const isServiceFound = availableServices.find(service => service.serviceId === serviceId);
    if (isServiceFound === undefined) {
        const errorMsg = createErrorMsg("server GET /api/tickets/:serviceId", `The service requested (${serviceId}) does not exists`);
        res.status(400).json(errorMsg)
        return;
    }

    const release = await lastTicketIdMutex.acquire();
    try {
        const newTicket = new Ticket(lastTicketId + 1, new Date(), serviceId, null);
        const result = await dao.addTicket(newTicket)
        lastTicketId += 1
        res.status(200).json(newTicket)
    } 
    catch (err) {
        console.log(err, "GET /api/tickets/:serviceId");
        res.status(503).json(ErrorMsgDb)
    }
    finally {
        release();
    }

});

/* Get all the available services
 * @param none 
 * @returns status: 200 for normal execution, 503 for db error
 * @returns an errorMsg 503. Returns an array of Services (in json) for status code 200 
 */
app.get('/api/services', (req, res) => {
    dao.getServices()
        .then(services => res.status(200).json(services))
        .catch(err => {
            console.log(err, "GET /api/services");
            res.status(503).json(ErrorMsgDb)
        });
});

app.get('/api/tickets', async (req, res) => {
    try { 
        const result = await dao.getTickets();
        const id = await dao.getLastTicketIdByDay(new Date())
        console.log("Last ticket ID of " + new Date().toISOString(), id);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
    }
});
/* Request to add a new service to the system 
 * @param Service in json. Example {"serviceName": "foo", "serviceTime": 400}
 * @returns status: 201 for normal execution, 400 for undefined fields and for a serviceName already present in the current available services, and 503 for db error
 * @returns an errorMsg 400, 503. Returns the newly created Service as json for status code 201 
 */
app.post('/api/services', (req, res) => {

    const nServiceName = req.body.serviceName;
    const nServiceTime = req.body.serviceTime;

    if(nServiceName === undefined || nServiceTime === undefined) {
        const errMsg = createErrorMsg("Server POST /api/services", `One or more field are undefined: serviceName = ${nServiceName}, serviceTime = ${nServiceTime}`);
        res.status(400).json(errMsg);
        return;
    }

    const isServiceFound = availableServices.find(service => service.serviceName.toLowerCase() === nServiceName.toLowerCase());

    if (!isServiceFound) {
        const newService = new Service(null, nServiceName.toLowerCase(), parseInt(nServiceTime))
        dao.addService(newService)
            .then(serviceId => {
                newService.serviceId = serviceId 
                availableServices.push(newService)
                res.status(201).json(newService)
            })
            .catch(err => {
                console.log(err, "POST /api/services");
                res.status(503).json(ErrorMsgDb)
            });
    } else {
        const err = createErrorMsg("Server POST /api/services", `A service with this name already exists: ${nServiceName}`)
        res.status(400).json(err)
    }
});

/* Update an existing service
 * @param Service in json. All the fields must be present (with the exception of serviceId). Example {"serviceName": "foo", "serviceTime": 400}
 * @route_parameter serviceId 
 * @returns status: 200 for normal execution, 400 for undefined fields or an unknown service, 503 for db error
 * @returns an errorMsg 400, 503. Returns the updated Service as json for status code 200 
 */
app.put('/api/services/:serviceId', (req, res) => {
    const nServiceName = req.body.serviceName;
    const nServiceTime = req.body.serviceTime;
    const nServiceId = parseInt(req.params.serviceId)

    if(nServiceName === undefined || nServiceTime === undefined) {
        const errMsg = createErrorMsg(`Server PUT /api/services/${nServiceId}`, `One or more field are undefined: serviceName = ${nServiceName}, serviceTime = ${nServiceTime}`);
        res.status(400).json(errMsg)
        return;
    }

    const isServiceFound = availableServices.find(service => service.serviceId === nServiceId);

    if (isServiceFound != undefined) {
        const updatedService = new Service(nServiceId, nServiceName, parseInt(nServiceTime))
        dao.updateService(updatedService)
            .then(service => {
                const index = availableServices.findIndex(s => s.serviceId === nServiceId);
                availableServices[index] = updatedService;
                res.status(200).json(updatedService);
            })
            .catch(err => {
                console.log(err, `PUT /api/services/${nServiceId}`);
                res.status(503).json(ErrorMsgDb);
            });
    } else {
        const err = createErrorMsg(`Server PUT /api/services/${nServiceId}`, `You are trying to update a service that does not exists: serviceId = ${nServiceId}, serviceName = ${nServiceName}, serviceTime = ${nServiceId}`);
        res.status(400).json(err);
    }
});

/* Delete an existing service
 * @param none 
 * @route_parameter serviceId 
 * @returns status: 200 for normal execution, 404 a non-existing element, 503 for db error
 * @returns an errorMsg 404, 503. Returns a confirmation string for status code 200
 */
app.delete('/api/services/:serviceId', (req, res) => {
    const serviceId = parseInt(req.params.serviceId)
    const service = new Service(serviceId, null, null)

    dao.deleteService(service)
        .then((ret) => {
            if(ret === 0) {
                const errMsg = createErrorMsg(`server delete /api/services/:${service.serviceId}`, `service (id == ${service.serviceId}) does not exists`);
                console.log(errMsg);
                res.status(404).json(errMsg);
                return;
            }

            const indexServiceToDelete = availableServices.findIndex(elem => elem.serviceId === serviceId)
            availableServices.splice(indexServiceToDelete, 1)
            console.log(availableServices)
            res.status(200).send(`The service ${service.serviceId} was successfully deleted`)
        })
        .catch(err => {
            console.log(err, `/api/services/${serviceId}`)
            res.status(503).json(ErrorMsgDb);
        });

});

/* Request to add a new service to a counter
 * @param  pair of service and counter as json. Example {"service": {"serviceId": 1, "serviceName": "foo", "serviceTime": 4000}, "counter": {"counterId": 1}}. The mandatory field are serviceId and counterId
 * @returns status: 200 for normal execution, 400 for undefined fields and if the pair already exists, 503 for db error
 * @returns an errorMsg 400, 503. Returns a confirmation string for status code 200
 */
app.post('/api/counterservices', (req, res) => {
    const serviceJson =  req.body.service;
    const counterJson = req.body.counter;

    if(serviceJson === undefined || counterJson === undefined) {
        const errMsg = createErrorMsg("Server POST /api/counterservices", `service and/or counter are undefined: service = ${JSON.stringify(serviceJson)}, counter = ${JSON.stringify(counterJson)}`)
        res.status(400).json(errMsg)
        return;
    }

    const service = new Service(parseInt(serviceJson.serviceId), serviceJson.serviceName, parseInt(serviceJson.serviceTime));
    const counter = new Counter(parseInt(counterJson.counterId));

    dao.addCounterService(counter, service)
        .then(ret => res.status(200).send(`service: ${service.serviceId} - counter: ${counter.counterId} successfully added`))
        .catch(err => {
            if(err.errno === 19) {
                const errMsg = createErrorMsg("server POST /api/counterservices", `service: ${service.serviceId} - counter: ${counter.counterId} already exists`);
                res.status(400).json(errMsg);
                return;
            }

            console.log(err.errno, "POST /api/counterservices");
            res.status(503).json(ErrorMsgDb)
        });
});

/* Request to delete a service from a counter
 * @param  pair of service and counter as json. Example {"service": {"serviceId": 1, "serviceName": "foo", "serviceTime": 4000}, "counter": {"counterId": 1}}. The mandatory field are serviceId and counterId
 * @returns status: 200 for normal execution, 400 for undefined fields, 403 for non-existing pair, and 503 for db error
 * @returns an errorMsg 400, 404 and 503. Returns a confirmation string for status code 200
 */
app.delete('/api/counterservices', (req, res) => {
    const serviceJson =  req.body.service;
    const counterJson = req.body.counter;

    if(serviceJson === undefined || counterJson === undefined) {
        const errMsg = createErrorMsg("server delete /api/counterservices", `service and/or counter are undefined: service = ${JSON.stringify(serviceJson)}, counter = ${JSON.stringify(counterJson)}`)
        res.status(400).json(errMsg)
        return;
    }

    const service = new Service(parseInt(serviceJson.serviceId), serviceJson.serviceName, parseInt(serviceJson.serviceTime));
    const counter = new Counter(parseInt(counterJson.counterId));

    dao.deleteCounterService(counter, service)
        .then((ret) => {
            if(ret === 0) {
                const errMsg = createErrorMsg(`server delete /api/services/counterservices`, `pair service: ${service.serviceId} - counter: ${counter.counterId} does not exists`);
                console.log(errMsg);
                res.status(404).json(errMsg);
                return;
            }

            res.status(200).send(`service: ${service.serviceId} - counter: ${counter.counterId} was successfully deleted`)})
        .catch(err => {
            console.log(err, "DELETE /api/services/:serviceId");
            res.status(503).json(ErrorMsgDb)
        });
});

app.get('/api', (req, res) => res.json(APIRoutes))

app.get('/test', async (req, res) => {
    try { 
        const dppath = "./testing.db"
        const ris = await test.setup(dbpath);
        console.log(ris)
        try {
            lastTicketId = await dao.getLastTicketIdByDay(new Date());
            availableServices = await dao.getServices(); 
            //console.log("LAST TICKET ID", lastTicketId)
        }
        catch (err) { 
            msg = createErrorMsg("Server", "Failed updating 'availableServices' at /test")
            console.log(msg)
            throw(err)
        };
        res.json(200).send();
    } catch (err) {
        res.send(err)
    }
});

app.all('*', (req, res) => {
    res.status(403).send("ACCESS DENIED, visit /api")
});

const init = async () => {
    if (lastTicketId === null) {
        try {
            lastTicketId = await dao.getLastTicketIdByDay(new Date());
        }
        catch (err) {
            if (err.error === "no tickets") {
                lastTicketId = 0
            }
            else {
                msg = createErrorMsg("server", "Failed at initializing 'lastTicketId' at init")
                console.log(msg)
                throw (err)
            }
        };
    }

    if (availableServices === null) {
        try {
            availableServices = await dao.getServices(); 
        }
        catch (err) { 
            msg = createErrorMsg("Server", "Failed updating 'availableServices' at init")
            console.log(msg)
            throw(err)
        };
    }
}

function printConfig() {
    console.log("System parameters:");
    console.log("Last ticket id", lastTicketId)
    console.log("Available Services:")
    console.log(availableServices)
    console.log("Current database path:", dbpath)
}

(async () => {
    try { 
        console.log("INITIALIZING the system")
        if (process.argv[2] === "--test") {
            dbpath = "./testing.db"
            const ris = await test.setup(dbpath);
            console.log(ris)
        }
        await dao.init({"dbpath": dbpath})
        await init();
        printConfig();
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    } catch (e) {
        console.log("Failed initializing the system");
        console.log(e);
        return process.exit(22);
    }
})()
