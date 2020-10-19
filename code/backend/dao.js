/**
 * functions to manage database interactions
 * 
 * @author Gastaldi Paolo
 * @author Pisanello Alberto
*/

'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('office_queue.db', (err) => {
    if (err) throw err;
});

const Service = require('./service.js');
const Counter = require('./counter.js');
const Ticket = require('./ticket.js');

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

            resolve(this.changes);
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
            resolve(this.changes);
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
        const sql = "INSERT INTO Ticket(ticketId, date, serviceId, estimatedTime) VALUES (?, ?, ?, ?)";
        db.run(sql, [ticket.ticketId, ticket.date.toISOString(), ticket.serviceId, ticket.estimatedTime], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.lastId);
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
        const sql = "SELECT MAX(ticketId) FROM Ticket WHERE date(date) = date(?)";
        db.get(sql, [date.toISOString()], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            if(rows['MAX(ticketId)'] === null) {
                reject({ error: "no tickets" });
                return;
            }

            resolve(rows['MAX(ticketId)']);
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
