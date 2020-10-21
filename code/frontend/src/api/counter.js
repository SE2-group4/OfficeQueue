class Counter{
    constructor(counterId){
        this.counterId=counterId;
    }

    static from(json){
        return Object.assign(new Counter(),json);
    }
}

export default Counter;