/**
 * @author Gastaldi Paolo
 * @author Pisanello Alberto
 */

'use strict'

const moment = require('moment');

/**
 * 
 */
class Ticket {
    /**
     * constructor
     * @param {int} ticketId 
     * @param {Date} date 
     * @param {int} serviceId 
     * @param {int} estimatedTime 
     */
    constructor(ticketId = -1, date, serviceId, estimatedTime) {
        this.ticketId = ticketId;
        this.date = date;
        this.serviceId = serviceId;
        this.estimatedTime = estimatedTime;

    }

    /**
     * transform a DB row into an object
     * @param {Object} row 
     */
    static fromRow(row) {
        const ticketId = row.ticketId;
        const date = new Date(row.date);
        const serviceId = row.serviceId;
        const estimatedTime = row.estimatedTime;
        return new Ticket(ticketId, date, serviceId, estimatedTime);
    }

}

module.exports = Ticket;
