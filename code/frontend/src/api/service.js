class Service{
    constructor(serviceId,serviceName,serviceTime){
        this.serviceId=serviceId;
        this.serviceName=serviceName;
        this.serviceTime=serviceTime;
    }

    static from(json){
        return Object.assign(new Service(),json);
    }
}

export default Service;