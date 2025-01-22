import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../base/Processor.js'

class ShowSettings extends Processor {

    constructor(config) {
        super(config)
        //   this.verbose = false
    }

    async process(message) {
        //  logger.setLogLevel('debug')
        logger.debug(`ShowSettings.process`)

        const property = ns.trn.name

        logger.debug(`ShowSettings.process, property = ${property}`)

        const value = await this.getProperty(property)

        logger.debug(`ShowSettings.process, value  = ${value}`)

        return this.emit('message', message)
    }
}

export default ShowSettings
