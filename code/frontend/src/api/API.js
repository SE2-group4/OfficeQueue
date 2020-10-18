import Service from './service.js';
import Ticket from './ticket.js';
const baseurl='/api';

//getServices : versione test
async function getServicesT(){
    return [{serviceID:'s1',serviceName:'servizio1',serviceTime:'10'},
    {serviceID:'s2',serviceName:'servizio2',serviceTime:'15'},
    {serviceID:'s3',serviceName:'servizio3',serviceTime:'20'}];
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

const API={getServices,getServicesT,getTicket,getTicketT};
export default API;