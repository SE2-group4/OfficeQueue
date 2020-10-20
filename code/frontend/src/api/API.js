import Service from './service.js';
import Ticket from './ticket.js';
import Association from './association.js';
const baseurl='/api';

/*---------TEST VERSION--------------*/

 let services= [{serviceId:'s1',serviceName:'servizio1',serviceTime:'10'},
                {serviceId:'s2',serviceName:'servizio2',serviceTime:'15'},
                {serviceId:'s3',serviceName:'servizio3',serviceTime:'20'}];

let servicesCounters = [{counterId : "c1",serviceId : "s2"},{counterId : "c2",serviceId: "s1"}];
let counters = [{counterId : "c1"},{counterId : "c2"}];
//getServices : versione test
async function getServicesT(){
    return services;
}

async function getCountersT(){
    return counters;
} 

async function getServicesCountersT(){
    return servicesCounters;
}
async function editServiceT(id,name,time){
    console.log(id);
    console.log(name);
    console.log(time);
    for (let i=0;i<services.length;i++)
        if(services[i].serviceId===id){
            services[i].serviceName=name;
            services[i].serviceTime=time;
        }
    console.log(services);
}
async function removeServiceT(id){
    let c=0;
    for (let s of services){
        if(s.serviceId===id)
            services.splice(c,1);
        c++;
    }

}
async function addServiceT(name,time){
    services.splice(services.length,1,new Service(services.length,name,time));
}
async function removeAssociationT(counterId,serviceId){
    for (let i = 0;i<servicesCounters.length;i++)
        if(servicesCounters[i].counterId==counterId && servicesCounters[i].serviceId==serviceId)
            servicesCounters.splice(i,1);
            
}
async function addAssociationT(counterId,serviceId){
    console.log(counterId);
    console.log(serviceId);
    servicesCounters.splice(servicesCounters.length,1,new Association(counterId,serviceId));
    console.log(servicesCounters);
}
async function removeCounterT(counterId){
    for (let i=0;i<counters.length;i++)
        if(counters[i].counterId===counterId)
            counters.splice(i,1);
}

async function getTicketT(serviceID){
    return {ticketID:'t1',date:'',serviceID:serviceID,estimatedTime:'1h20min'};
}
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
//GET /api/counterservices
//todo

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

const API={getServices,getServicesT,getTicket,addService,addAssociation,removeService,editService,getTicketT,getCountersT,getServicesCountersT,editServiceT,removeServiceT,addServiceT,removeAssociationT,addAssociationT,removeCounterT};
export default API;