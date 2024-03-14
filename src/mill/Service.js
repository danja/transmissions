import { EventEmitter } from 'events'

class Service extends EventEmitter {

    constructor(config) {
        super() // Call EventEmitter constructor
        this.config = config
    }

    async execute(data) {
        throw new Error('execute method not implemented');
    }
}

export default Service 