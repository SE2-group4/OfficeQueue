import Service from './service.js';
import Ticket from './ticket.js';
import Association from './association.js';
import Counter from './counter.js';
const baseurl='/api';


/*------------------------------------*/
//POST /api/services 
async function addService(name,time){
    return new Promise((resolve,reject) => {
        fetch(baseurl+'/services',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({serviceName: name, serviceTime: time}),
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                .then((obj) => { resolve(obj )}) 
                .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

//GET /api/services -> Service[]
async function getServices(){
    return new Promise((resolve,reject) => {
        fetch(baseurl+'/services',{
            method: 'GET'
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                .then((obj) => { resolve( obj.map((c) => Service.from(c)) )}) 
                .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}


//GET /api/counters -> Service[]
async function getCounters(){
    return new Promise((resolve,reject) => {
        fetch(baseurl+'/counters',{
            method: 'GET'
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                .then((obj) => { resolve( obj.map((c) => Counter.from(c)) )}) 
                .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

//GET /api/counterservices
async function getServicesCounters(){
    return new Promise((resolve,reject) => {
        fetch(baseurl+'/counterservices',{
            method: 'GET'
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                .then((obj) => { resolve( obj.map((c) => Association.from(c)) )}) 
                .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}
//DELETE /api/counterservices/
async function removeAssociation(counter,service){
    return new Promise((resolve,reject)=>{
        fetch(baseurl + `/counterservices/`,{
            method : 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({counter : counter,service : service}),
        }).then((response)=>{
            resolve(null);
        }).catch((err)=>{ reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) })
    });
};
//DELETE /api/services/:serviceId
async function removeService(id){
    return new Promise((resolve,reject)=>{
        fetch(baseurl + `/services/${id}`,{
            method : 'DELETE'
        }).then((response)=>{
            resolve(null);
        }).catch((err)=>{ reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) })
    });
};

//POST /api/counterservices
async function addAssociation(counter,service){
    return new Promise((resolve, reject) => {
        fetch(baseurl + `/counterservices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({counter : counter,service : service}),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                reject(null);
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

//PUT /api/services/:serviceId
async function editService(id,name,time){
    return new Promise((resolve, reject) => {
        fetch(baseurl + `/services/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({serviceName : name,serviceTime : time}),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                reject(null);
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

//GET /api/tickets/:serviceID -> Ticket
async function getTicket(serviceID){
    return new Promise((resolve,reject) => {
        fetch(baseurl+'/tickets/' + serviceID,{
            method: 'GET'
        }).then((response) => {
            const status = response.status;
            if (response.ok) {
                response.json()
                .then((obj) => { resolve( Ticket.from(obj) )}) 
                .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
    
}

const API={getServices,getTicket,getCounters,addService,addAssociation,removeService,editService,getServicesCounters,removeAssociation};
export default API;