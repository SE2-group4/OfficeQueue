/*---------API - TEST VERSION--------------*/

import Service from '../api/service.js';
import Ticket from '../api/ticket.js';
import Association from '../api/association.js';

let services= [{serviceId:'s1',serviceName:'servizio1',serviceTime:'10'},
                {serviceId:'s2',serviceName:'servizio2',serviceTime:'15'},
                {serviceId:'s3',serviceName:'servizio3',serviceTime:'20'}];
let servicesCounters = [{counterId : "c1",serviceId : "s2"},{counterId : "c2",serviceId: "s1"}];
let counters = [{counterId : "c1"},{counterId : "c2"}];

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

async function getTicketT(serviceId){
    return {ticketID:'t1',date:'',serviceId:serviceId,estimatedTime:'1h20min'};
}

const APITest={getServicesT,getTicketT,getCountersT,getServicesCountersT,editServiceT,removeServiceT,addServiceT,removeAssociationT,addAssociationT,removeCounterT};
export default APITest;