class Ticket{
    constructor(ticketID,date,serviceID,estimatedTime){
        this.ticketID=ticketID;
        this.date=date;
        this.serviceID=serviceID;
        this.estimatedTime=estimatedTime;
    }

    static from(json){
        return Object.assign(new Ticket(),json);
    }
}

export default Ticket;