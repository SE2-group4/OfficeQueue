class Ticket{
    constructor(ticketId,date,serviceId,estimatedTime){
        this.ticketId=ticketId;
        this.date=date;
        this.serviceId=serviceId;
        this.estimatedTime=estimatedTime;
    }

    static from(json){
        return Object.assign(new Ticket(),json);
    }
}

export default Ticket;