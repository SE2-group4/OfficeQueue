'use strict'

const express = require("express");
const dao = require("./dao.js"); 
const Mutex = require('async-mutex').Mutex;
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');


const Service = require('./service.js')
const Ticket = require('./ticket.js')
const Counter = require('./counter.js')

const app = express()
const PORT = 3001;
let lastTicketId = null;
let availableServices = null;
const lastTicketIdMutex = new Mutex();

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

app.get('/api/tickets/:serviceId', async (req, res) => {
    const serviceId = parseInt(req.params.serviceId, 10)
    const isServiceFound = availableServices.find(service => service.serviceId === serviceId);
    if (isServiceFound === undefined) {
        errorMsg = createErrorMsg("server GET /api/tickets/:serviceId", `The service requested (${serviceId}) does not exists`);
        res.status(400).json(errorMsg)
    }

    const release = await lastTicketIdMutex.acquire();
    try {
        const newTicket = new Ticket(lastTicketId + 1, new Date(), serviceId, null);
        const result = await dao.addTicket(newTicket)
        lastTicketId += 1
        res.json(newTicket)
    } 
    catch (err) {
        console.log(err, "GET /api/tickets/:serviceId");
        res.status(503).json(ErrorMsgDb)
    }
    finally {
        release();
    }

});

app.get('/api/services', (req, res) => {
    dao.getServices()
        .then(services => res.status(200).json(services))
        .catch(err => {
            console.log(err, "GET /api/services");
            res.status(503).json(ErrorMsgDb)
        });
});

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
                res.status(201).json(updatedService);
            })
            .catch(err => {
                console.log(err, `PUT /api/services/${nServiceId}`);
                res.status(503).json(ErrorMsgDb);
            });
    } else {
        const err = createErrorMsg(`Server PUT /api/services/${nServiceId}`, `You are trying to update a service that does not exists: serviceId = ${nServiceId}, serviceName = ${req.body.ServiceName}`);
        res.status(400).json(err);
    }
});

app.delete('/api/services/:serviceId', (req, res) => {
    const serviceId = parseInt(req.params.serviceId)
    const service = new Service(serviceId, null, null)

    dao.deleteService(service)
        .then(() => {
            const indexServiceToDelete = availableServices.findIndex(elem => elem.serviceId === serviceId)
            availableServices.splice(indexServiceToDelete, 1)
            res.send(`The service ${service.serviceId} was successfully deleted`)
            
        })
        .catch(err => {
            console.log(err, `/api/services/${serviceId}`)
            if (err === undefined) {
                const errMsg = createErrorMsg(`Server DELETE /api/services/:${service.serviceId}`, `Service (id == ${service.serviceId}) does not exists`);
                console.log(errMsg);
                res.status(503).json(errMsg);
                return;
            }
            res.status(503).json(ErrorMsgDb);
        });

});

// JSON format for the caller
// {"service": {"serviceId":1, "serviceName": "foo", "serviceTime": 4000}, "counter": {"counterId": 1}}
// NOTE: the important field are serviceId and counterId, the rest are ignored by the DB.
// maybe pass only the counterId and serviceId
app.post('/api/counterservices', (req, res) => {
    const serviceJson =  req.body.service;
    const counterJson = req.body.counter;

    if(serviceJson === undefined || counterJson === undefined) {
        const errMsg = createErrorMsg("Server POST /api/counterservices", "service and/or counter are undefined")
        res.status(400).json(errMsg)
        return;
    }

    const service = new Service(parseInt(serviceJson.serviceId), serviceJson.serviceName, parseInt(serviceJson.serviceTime));
    const counter = new Counter(parseInt(counterJson.counterId));

    dao.addCounterService(counter, service)
        .then(services => res.json(services))
        .catch(err => {
            console.log(err, "route: /api/services");
            res.status(503).json(ErrorMsgDb)
        });
});

// JSON format for the caller
// {"service": {"serviceId":1, "serviceName": "foo", "serviceTime": 4000}, "counter": {"counterId": 1}}
// NOTE: the important field are serviceId and counterId, the rest are ignored by the DB.
// maybe pass only the counterId and serviceId
app.delete('/api/counterservices', (req, res) => {
    const serviceJson =  req.body.service;
    const counterJson = req.body.counter;

    if(serviceJson === undefined || counterJson === undefined) {
        const errMsg = createErrorMsg("Server DELETE /api/counterservices", "service and/or counter are undefined")
        res.status(400).json(errMsg)
        return;
    }

    const service = new Service(parseInt(serviceJson.serviceId), serviceJson.serviceName, parseInt(serviceJson.serviceTime));
    const counter = new Counter(parseInt(counterJson.counterId));

    dao.deleteCounterService(counter, service)
        .then(() => res.send(`Service: ${service.serviceId} - Counter: ${counter.counterId} was successfully deleted`))
        .catch(err => {
            console.log(err, "DELETE /api/services/:serviceId");
            res.status(503).json(ErrorMsgDb)
        });
});

app.get('/api', (req, res) => res.json(APIRoutes))

app.get('/test', async (req, res) => {
    try { 
        const counterServices = await dao.getCounterServices();
        console.log(counterServices);
        res.send("OK")
    } catch (err) {
        res.send(err)
    }
});

app.all('*', (req, res) => {
    res.status(403).send("ACCESS DENIED, visit /api")
});

const init = async () => {
    if (lastTicketId === null) {
        await dao.getLastTicketIdByDay(new Date())
            .then(ret => lastTicketId = ret.ticketId)
            .catch(err => {
                if (err.error === "no tickets") {
                    lastTicketId = 0
                }
                else {
                    throw (err)
                    msg = createErrorMsg("DB", "Failed getLastTicketIdByDay at init")
                    console.log(msg)
                }
            });
    }

    if (availableServices === null) {
        await dao.getServices()
            .then(services => availableServices = services)
            .catch(err => {
                msg = createErrorMsg("DB", "Failed getServices at init")
                console.log(msg)
                throw(err)
            });
    }
}


function printConfig() {
    console.log("Last ticket id", lastTicketId)
    console.log("Available Services:")
    console.log(availableServices)
}

(async () => {
    try { 
        console.log("Initializing the system")
        await init();
        printConfig();
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    } catch (e) {
        console.log("Failed initializing the system");
        console.log(e);
        return process.exit(22);
    }
})()
