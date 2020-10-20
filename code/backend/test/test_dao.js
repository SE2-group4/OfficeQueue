/**
 * test suite for the dao module
 * 
 * @author Gastaldi Paolo
 * @author Pisanello Alberto
 */

'use strict'

const { fail } = require('assert');
const assert = require('assert');
const Counter = require('../counter.js');
const Service = require('../service.js');
const Ticket = require('../ticket.js');
const dao = require('./../dao.js');
const prepare = require('./../prepare_db.js').prepare;

const suite = describe('dao.js', function(){
    beforeEach(function(done) {
        prepare(done, false);
    });

    describe('getServices', function() {
        it('should return all services', function(done) {
            dao.getServices().then((results) => {
                assert.strictEqual(results.length, 3, "Wrong number of services");
                done();
            }).catch((err) => {
                fail();
                done();
            });
        });
    });

    describe('getTickets', function(){
        it('should return 3 values', function(done) {
            dao.getTickets().then((results) => {
                assert.strictEqual(results.length, 3, "Wrong number of tickets");
                done();
            }).catch((err) => {
                fail();
                done();
            });
        });
    });

    describe('addService', function(){
        it("should notify correct insertion", function(done) {
            const service = new Service(42, 'Ritiri', 7000);
            dao.addService(service).then((retVal) => {
                assert.ok(retVal > 0, "Data cannot be inserted");
                done();
            }).catch((err) => {
                fail();
                done();
            });
        })
    });

    describe('updateService', function(){
        const service = new Service(999, 'old name', 7000);

        beforeEach(function(done) {
            dao.addService(service).then((retVal) => {
                service.serviceId = retVal;
                done();
            });
        });

        it("update existing service should notify correct update", function(done) {
            const updatedService = new Service(service.serviceId, 'new name', 1800); // same serviceId

            dao.updateService(updatedService).then((retVal) => {
                assert.strictEqual(service.serviceId, retVal, "Data cannot be updated");
                done();
            }).catch((err) => {
                fail(err);
                done();
            });
        });

        it("update not existing service should send an error", function(done) {
            const service = new Service(0, 'new name', 1800);

            dao.updateService(service).then((retVal) => {
                fail(retVal);
                done();
            }).catch((err) => {
                assert.ok(true);
                done();
            });
        });
    });

    describe('deleteService', function() {
        const service = new Service(999, 'delete me', 7000);

        beforeEach(function(done) {
            dao.addService(service).then((retVal) => {
                service.serviceId = retVal;
                done();
            });
        });

        it("delete existing service should notify correct delete", function(done) {
            dao.deleteService(service).then((retVal) => {
                assert.strictEqual(service.serviceId, retVal, "Data cannot be deleted");
                done();
            }).catch((err) => {
                fail(err);
                done();
            });
        });

        it("delete not existing service should send an error", function(done) {
            const service = new Service(499); // same serviceId

            dao.deleteService(service).then((retVal) => {
                fail(retVal);
                done();
            }).catch((err) => {
                assert.ok(true);
                done();
            });
        });
    });

    describe('addTicket', function(){
        it("should insert new ticket", function(done) {
            const ticket = new Ticket(86, new Date(), 1, 9000);
            
            dao.addTicket(ticket).then((retVal) => {
                assert.ok(retVal > 0, "The ticket cannot be inserted");
                done();
            }).catch((err) => {
                fail(err);
                done();
            });
        });
    });

    describe('addCounterService', function(){
        it("should insert new counter-service", function(done) {
            const counter = new Counter(50);
            const service = new Service(50);

            dao.addCounterService(counter, service).then((retVal) => {
                assert.ok(retVal > 0, "The counter-service cannot be inserted");
                done();
            }).catch((err) => {
                fail(err);
                done();
            });
        });
    });


    describe('deleteCounterServices', function(){
        const counter = new Counter(50);
        const service = new Service(50);

        beforeEach(function(done) {
            dao.addCounterService(counter, service).then((retVal) => {
                done();
            });
        });

        it("delete existing counter-service should notify correct delete", function(done) {
            dao.deleteCounterService(counter, service).then((retVal) => {
                assert.ok(retVal > 0, "Data cannot be deleted");
                done();
            }).catch((err) => {
                fail(err);
                done();
            });
        });

        it("delete not existing counter-service should send an error", function(done) {
            const counter = new Counter(999);
            const service = new Service(999);

            dao.deleteCounterService(counter, service).then((retVal) => {
                fail(retVal);
                done();
            }).catch((err) => {
                assert.ok(true);
                done();
            });
        });
    });

    describe('getLastTicketIdByDate', function(){
        it('existing date should return max value', function(done) {
            dao.getLastTicketIdByDay(new Date()).then((ticket) => {
                assert.strictEqual(ticket.ticketId, 3, "Not the maximumn value");
                done();
            }).catch((err) => {
                fail(err);
                done();
            });
        });

        it('not existing date should return 0', function(done) {
            dao.getLastTicketIdByDay(new Date('1970/01/01')).then((ticket) => {
                assert.strictEqual(ticket.ticketId, 0, "No values can be found");
                done();
            }).catch((err) => {
                fail(err);
                done();
            });
        });
    });

    describe('getCounterServices', function(){
        it('should return 6 values', function(done) {
            dao.getCounterServices().then((results) => {
                assert.strictEqual(results.length, 6, "Wrong number of counter - service relationships");
                done();
            }).catch((err) => {
                fail();
                done();
            });
        });
    });
});

module.exports = suite;