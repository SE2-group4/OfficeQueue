class Service{
    constructor(serviceID,serviceName,serviceTime){
        this.serviceID=serviceID;
        this.serviceName=serviceName;
        this.serviceTime=serviceTime;
    }

    static from(json){
        return Object.assign(new Service(),json);
    }
}

export default Service;