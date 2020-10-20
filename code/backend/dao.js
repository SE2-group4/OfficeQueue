/**
 * functions to manage database interactions
 * 
 * @author Gastaldi Paolo
 * @author Pisanello Alberto
*/

'use strict';

const moment = require('moment');
const sqlite = require('sqlite3');
const db_file = './testing.db'; // relative reference for testing
// const db_file = './office_queue.db';
const db = new sqlite.Database(db_file, (err) => {
    if (err) throw err;
});

const Service = require('./service.js');
const Counter = require('./counter.js');
const Ticket = require('./ticket.js');

exports.init = function({dbpath}) {
    dbPath = dbpath;
    db = new sqlite.Database(dbPath, (err) => {
        if (err) throw err;
    });
}

/**
 * get all services
 * @returns {Array} list of services
 */
exports.getServices = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Service"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const services = [];
                rows.forEach(row => {
                    services.push(Service.fromRow(row));
                });
                resolve(services);
            }
        });
    });
}

/**
 * get all tickets
 * @returns {Array} list of tickets
 */
exports.getTickets = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Ticket"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const tickets = [];
                rows.forEach(row => {
                    tickets.push(Ticket.fromRow(row));
                });
                resolve(tickets);
            }
        });
    });
}

/**
 * insert a new service into DB
 * @param {Service} service
 * @returns {int} lastId
 */
exports.addService = function (service) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Service(serviceName, serviceTime) VALUES(?, ?)";
        db.run(sql, [service.serviceName, service.serviceTime], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    });
}

/**
 * modify an existing service
 * @param {Service} service
 * @returns {int} number of modified rows
 */
exports.updateService = function (service) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE Service SET serviceName = ?, serviceTime = ? WHERE serviceId = ?";
        db.run(sql, [service.serviceName, service.serviceTime, service.serviceId], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        })
    });
}

/**
 * remove a service from DB
 * @param {Service} service
 * @returns {int} number of modified rows
 */
exports.deleteService = function (service) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM Service WHERE serviceId = ?";
        db.run(sql, [service.serviceId], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        })
    });
}

/**
 * insert a new ticket into DB
 * @param {Ticket} ticket
 * @returns {int} last ID to check correct insertion
 */
exports.addTicket = function (ticket) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Ticket(ticketId, date, serviceId, estimatedTime) VALUES (?, DATE(?), ?, ?)";
        db.run(sql, [ticket.ticketId, moment(ticket.date).format("YYYY-MM-DD"), ticket.serviceId, ticket.estimatedTime], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    });
}

/**
 * insert a new relationship between a counter and a service
 * @param {Counter} counter 
 * @param {Service} service
 * @returns {int} last ID to check correct insertion
 */
exports.addCounterService = function (counter, service) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO CounterService(counterId, serviceId) VALUES (?, ?)";
        db.run(sql, [counter.counterId, service.serviceId], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    });
}

/**
 * remove an existing service from DB
 * @param {Counter} counter 
 * @param {Service} service
 * @returns {int} number of modified rows
 */
exports.deleteCounterService = function (counter, service) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM CounterService WHERE counterId = ? AND serviceId = ?";
        db.run(sql, [counter.counterId, service.serviceId], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.changes); 
        });
    });
}

/**
 * get the highest ticket ID given a certain date
 * @param {Date} date
 * @returns {int} ticketId 
 */
exports.getLastTicketIdByDay = function (date) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT MAX(ticketId) AS ticketId FROM Ticket WHERE date = DATE(?)";
        db.get(sql, [(moment(date).format("YYYY-MM-DD"))], (err, row) => {
            if(err || !row || !row.ticketId) {
                resolve(new Ticket(0));
                return;
            }

            resolve(Ticket.fromRow(row));
        });
    });
}

/**
 * get all counter - service relationships
 * @returns {Array} list of counter - service relationships
 */
exports.getCounterServices = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM CounterService";
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const res = [];
                rows.forEach(row => {
                    res.push(row);
                });
                resolve(res);
            }
        });
    });
}

