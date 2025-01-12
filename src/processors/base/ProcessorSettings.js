import logger from '../../utils/Logger.js'
import { EventEmitter } from 'events'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import footpath from '../../utils/footpath.js'

class ProcessorSettings {

    constructor(config) {
        this.config = config
    }

    getValue(property, fallback) {
        logger.log(`IDDDDDDDDDDD ${this.id}`)
        logger.log(`getMyConfigNode() = ${this.getMyConfigNode()}`)
        const poi = this.getMyPoi()
        logger.log(`PPPPPPPPPPPPPP ${poi.out(property).term}`)
        logger.log(`PROPERTY = ${property}`)


        const shortName = ns.getShortname(property)

        this.showMyConfig()
        if (this.message[shortName]) return this.message[shortName]

        // MANIFEST IS WHERE?
        const maybe = this.getPropertyFromMyConfig(property)
        //  this.showMyConfig()
        logger.log(`maybe = ${maybe}`)
        if (maybe) return maybe
        return fallback
    }
}
export default ProcessorSettings