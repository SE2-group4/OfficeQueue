import Service from './service.js';
import Ticket from './ticket.js';
const baseurl='/api';

/*---------TEST VERSION--------------*/

 let services= [{serviceID:'s1',serviceName:'servizio1',serviceTime:'10'},
                {serviceID:'s2',serviceName:'servizio2',serviceTime:'15'},
                {serviceID:'s3',serviceName:'servizio3',serviceTime:'20'}]
//getServices : versione test
async function getServicesT(){
    return services;
}

async function getCountersT(){
    return [{counterId : "c1"},{counterId : "c2"}];
}

async function getServicesCountersT(){
    return [{counterId : "c1",serviceID : "s2"},{counterId : "c2",serviceID: "s1"}];
}
async function editServiceT(id,name,time){
    /*let service = services.filter((s)=>s.serviceID===id);
    service[0].serviceName=name;
    service[0].serviceTime=time;
    console.log(service[0]);
    services.splice(1,0,service[0]);*/
    for (let i=0;i<services.length;i++)
        if(services[i].serviceID===id){
            services[i].serviceName=name;
            services[i].serviceTime=time;
        }
}
async function removeServiceT(id){
    let c=0;
    for (let s of services){
        if(s.serviceID===id)
            services.splice(c,1);
        c++;
    }

}
async function addServiceT(name,time){
    services.splice(services.length,1,new Service(services.length,name,time));
}
/*------------------------------------*/
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

//getTicket : versione test
async function getTicketT(serviceID){
    return {ticketID:'t1',date:'',serviceID:serviceID,estimatedTime:'1h20min'};
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

const API={getServices,getServicesT,getTicket,getTicketT,getCountersT,getServicesCountersT,editServiceT,removeServiceT,addServiceT};
export default API;