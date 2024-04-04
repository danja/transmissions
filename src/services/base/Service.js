import { EventEmitter } from 'events'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

class Service extends EventEmitter {

    constructor(config) {
        super()
        this.config = config
    }

    locateConfig() {
        const dataset = this.config
        const poi = grapoi({ dataset, term: this.configKey }).in()
        const configNode = poi.out(ns.trm.value)
        return configNode
    }

    async execute(data, context) {
        throw new Error('execute method not implemented')
    }
}

export default Service 