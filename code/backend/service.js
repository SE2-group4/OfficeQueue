/**
 * @author Gastaldi Paolo
 * @author Pisanello Alberto
 */

'use strict'

class Service {
    constructor(serviceId = -1, serviceName, serviceTime) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.serviceTime = serviceTime;
    }

    fromRow(row) {
        const serviceId = row.serviceId;
        const serviceName = row.serviceName;
        const serviceTime = row.serviceTime;
        return new Service(serviceId, serviceName, serviceTime);
    }
}

exports.Service = Service;