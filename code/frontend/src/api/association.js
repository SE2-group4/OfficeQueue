class Association{
    constructor(counterId,serviceId){
        this.counterId=counterId;
        this.serviceId=serviceId;
    }

    static from(json){
        return Object.assign(new Association(),json);
    }
}

export default Association;