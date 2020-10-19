const express = require("express");
const dao = require("./dao.js"); 
const Mutex = require('async-mutex').Mutex;
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
        "param": "server",
        "msg": "database promise rej"
    }]
}

function createErrorMsg(from, msg) {
    err = {
        "from" : from,
        "msg" : msg
    }
    return err
}


app.get('/api/tickets/:serviceId', async (req, res) => {
    serviceId = parseInt(req.params.serviceId, 10)
    isServiceFound = availableServices.find(service => service.serviceId === serviceId);
    if (isServiceFound === undefined) {
        errorMsg = createErrorMsg("server GET /api/tickets/:serviceId", `The service requested (${serviceId}) does not exists`);
        res.status(400).json(errorMsg)
    }

    const release = await lastTicketIdMutex.acquire();
    try {
        newTicket = new Ticket(lastTicketId + 1, new Date(), serviceId, null);
        result = await dao.addTicket(newTicket)
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
        .then(services => res.json(services))
        .catch(err => {
            console.log(ErrorMsgDb, "GET /api/services");
            res.status(503).json(ErrorMsgDb)
        });
});

app.post('/api/services', (req, res) => {
    nServiceName = req.body.serviceName.toLowerCase();
    console.log(req.body.serviceName.toLowerCase())
    isServiceFound = availableServices.find(service => service.serviceName.toLowerCase() === nServiceName);

    if (!isServiceFound) {
        newService = new Service(null, nServiceName, parseInt(req.body.serviceTime))
        dao.addService(newService)
            .then(service => {
                availableServices.push(service)
                res.status(201).json(service)
            })
            .catch(err => {
                console.log(ErrorMsgDb, "POST /api/services");
                res.status(503).json(ErrorMsgDb)
            });
    } else {
        err = createErrorMsg("Server POST /api/services", `A service with this name already exists: ${nServiceName}`)
        res.status(400).json(err)
    }
});

app.put('/api/services/:serviceId', (req, res) => {
    nServiceId = parseInt(req.params.serviceId)
    isServiceFound = availableServices.find(service => service.serviceId === nServiceId);

    if (isServiceFound != undefined) {
        updatedService = new Service(nServiceId, req.body.serviceName, parseInt(req.body.serviceTime))
        console.log(updatedService)
        dao.updateService(updatedService)
            .then(service => {
                let index = availableServices.findIndex(s => s.serviceId === nServiceId);
                availableServices[index] = updatedService;
                res.status(201).json(updatedService);
            })
            .catch(err => {
                console.log(err, "PUT /api/services/:serviceId");
                res.status(503).json(ErrorMsgDb);
            });
    } else {
        err = createErrorMsg("server /api/services/:serviceId", `You are trying to update a service that does not exists serviceId = ${nServiceId}, serviceName = ${req.body.ServiceName}`);
        res.status(400).json(err);
    }
});

app.delete('/api/services/:serviceId', (req, res) => {
    const serviceId = parseInt(req.params.serviceId)
    const service = new Service(serviceId, null, null)

    dao.deleteService(service)
        .then(() => res.send(`The service ${service.serviceId} was successfully deleted`))
        .catch(err => {
            if (err === undefined) {
                errMsg = createErrorMsg(`Server DELETE /api/services/:${service.serviceId}`, `Service ${service.serviceId} does not exists`)
                console.log(errMsg)
                res.status(503).json(errMsg)
                return;
            }
            res.status(503).json(ErrorMsgDb)
        });

});

// JSON format for the caller
// {"service": {"serviceId":1, "serviceName": "foo", "serviceTime": 4000}, "counter": {"counterId": 1}}
// NOTE: the important field are serviceId and counterId, the rest are ignored by the DB.
// maybe pass only the counterId and serviceId
app.post('/api/counterservices', (req, res) => {
    serviceJson =  req.body.service;
    counterJson = req.body.counter;
    service = new Service(parseInt(serviceJson.serviceId), serviceJson.serviceName, parseInt(serviceJson.serviceTime));
    counter = new Counter(parseInt(counterJson.counterId));

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
    serviceJson =  req.body.service;
    counterJson = req.body.counter;
    service = new Service(parseInt(serviceJson.serviceId), serviceJson.serviceName, parseInt(serviceJson.serviceTime));
    counter = new Counter(parseInt(counterJson.counterId));

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
        tickets = await dao.getTickets()
        counterServices = await dao.getCounterServices()
        console.log(counterServices)
        res.send("OK")
    } catch (err) {
        res.send(err)
    }
});

app.all('*', (req, res) => {
    res.status(401).send("ACCESS DENIED, visit /api")
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
