import { EventEmitter } from 'events'

class Service extends EventEmitter {

    constructor(config) {
        super()
        this.config = config
    }

    async execute(data, context) {
        throw new Error('execute method not implemented')
    }
}

export default Service 