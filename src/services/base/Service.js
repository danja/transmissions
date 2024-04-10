import { EventEmitter } from 'events'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

class Service extends EventEmitter {

    constructor(config) {
        super()
        this.config = config
        this.messageQueue = []
        this.processing = false
    }

    locateConfig() {
        const dataset = this.config
        const poi = grapoi({ dataset, term: this.configKey }).in()
        const configNode = poi.out(ns.trm.value)
        return configNode
    }

    async receive(data, context) {
        await this.enqueue(data, context)
    }

    async enqueue(data, context) {
        this.messageQueue.push({ data, context })
        if (!this.processing) {
            this.executeQueue()
        }
    }

    async executeQueue() {
        this.processing = true
        while (this.messageQueue.length > 0) {
            const { data, context } = this.messageQueue.shift()
            await this.execute(data, context)
        }
        this.processing = false
    }

    async execute(data, context) {
        throw new Error('execute method not implemented')
    }
}

export default Service 