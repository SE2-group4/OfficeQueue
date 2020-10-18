/**
 * @author Gastaldi Paolo
 * @author Pisanello Alberto
 */

'use strict'

/**
 * 
 */
class Ticket {
    /**
     * 
     * @param {int} ticketId 
     * @param {Date} date 
     * @param {int} serviceId 
     * @param {int} estimatedTime 
     */
    constructor(ticketId = -1, date, serviceId, estimatedTime) {
        this.ticketId = ticketId;
        this.date = moment(date);
        this.serviceId = serviceId;
        this.estimatedTime = estimatedTime;
    }
}

module.export = Ticket;