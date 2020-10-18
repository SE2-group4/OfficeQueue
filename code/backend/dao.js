/**
 * 
 * @author Gastaldi Paolo
 * @author Pisanello Alberto
*/

'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('office_queue.sqlite', (err) => {
    if (err) throw err;
});

const Service = require('./service.js');
const Counter = require('./counter.js');
const Ticket = require('./ticket.js');

exports.getServices = function () {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Service"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                console.log(err);
            }
            else {
                const services = [];
                rows.forEach(row => {
                    services.push(createService(row));
                });
                resolve(services);
            }
        });
    });
}

/**
 * 
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
 * 
 * @param {Service} service 
 */
exports.updateService = function (service) {
    return new Promise((reject, resolve) => {
        const sql = "UPDATE Service SET serviceName = ?, serviceTime = ? WHERE serviceId = ?";
        db.run(sql, [service.serviceName, service.serviceTime, service.serviceId], (err) => {
            if(err) {
                reject(err);
                return;
            }

            resolve();
        })
    });
}

/**
 * 
 * @param {Service} service 
 */
exports.deleteService = function (service) {
    return new Promise((reject, resolve) => {
        const sql = "DELETE Service WHERE serviceId = ?";
        db.run(sql, [service.serviceId], (err) => {
            if(err) {
                reject(err);
                return;
            }

            resolve();
        })
    });
}

/**
 * 
 * @param {Ticket} ticket 
 */
exports.addTicket = function (ticket) {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO Ticket(ticketId, date, serviceId, estimatedTime) VALUES (?, DATE(?), ?, ?)";
        db.run(sql, [ticket.ticketId, ticket.date.toISOString(), ticket.serviceId, ticket.estimatedTime], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve(this.lastID);
        });
    });
}

/**
 * 
 * @param {Counter} counter 
 * @param {Service} service 
 */
exports.addCounterService = function (counter, service) {
    return new Promise((resolve, reject) => {
        const sql = "INSERTO INTO CounterService(counterId, serviceId) VALUES (?, ?)";
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
 * 
 * @param {Counter} counter 
 * @param {Service} service 
 */
exports.deleteCounterService = function (counter, service) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE CounterService WHERE counterId = ? AND serviceId = ?";
        db.run(sql, [counter.counterId, service.serviceId], function(err) {
            if(err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
}

/**
 * 
 * @param {Date} date
 * @returns {Ticket} ticket
 */
exports.getLastTicketIdByDay = function (date) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT MAX(ticketId) FROM Ticket WHERE date = DATE(?)";
        db.get(sql, [date.toISOString()], (err, rows) => {
            if(err) {
                reject(err);
                return;
            }

            if(rows.length != 1) {
                reject({ error: "no tickets" });
                return;
            }

            const ticket = new Ticket(rows[0]);
            resolve(ticket);
        });
    });
}
