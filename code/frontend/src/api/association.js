class Association{
    constructor(counterId,serviceId){
        this.counterId=counterId;
        this.serviceID=serviceId;
    }

    static from(json){
        return Object.assign(new Association(),json);
    }
}

export default Association;