/**
 * @author Gastaldi Paolo
 * @author Pisanello Alberto
 */

'use strict'

class Counter {
    /**
     * constructor
     * @param {int} counterId 
     */
    constructor(counterId = -1) {
        this.counterId = counterId;
    }
}

module.exports = Counter;
