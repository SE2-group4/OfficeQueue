/**
 * @author Gastaldi Paolo
 * @author Pisanello Alberto
 */

'use strict'

class Counter {
    /**
     * constructor
     * @param {int} conterId 
     */
    constructor(conterId = -1) {
        this.conterId = conterId;
    }
}

module.export = Counter;