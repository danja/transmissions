import { EventEmitter } from 'events'

import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'

class Service extends EventEmitter {

    constructor(config) {
        super()
        this.config = config
        this.messageQueue = []
        this.processing = false
        this.doneMessage = '~[DONE]~'
    }

    locateConfig() {
        const dataset = this.config
        const poi = grapoi({ dataset, term: this.configKey }).in()
        const configNode = poi.out(ns.trm.value)
        return configNode
    }

    async receive(data, context) {
        //  logger.log('Service.RECEIVE data = ' + data)
        await this.enqueue(data, context)
    }

    async enqueue(data, context) {
        // logger.log('Service.enqueue data = ' + data)
        this.messageQueue.push({ data, context })
        if (!this.processing) {
            this.executeQueue()
        }
    }

    async executeQueue() {
        // logger.log('Service.executeQueue')
        this.processing = true
        while (this.messageQueue.length > 0) {
            const { data, context } = this.messageQueue.shift()
            //   logger.log('Service.executeQueue data = ' + data)
            await this.execute(data, context)
        }
        this.processing = false
    }

    async execute(data, context) {
        throw new Error('execute method not implemented')
    }

    // to quasi-synchronise :(
    async doEmit(message, data, context) {
        this.emit(message, data, context)
    }
}

export default Service 