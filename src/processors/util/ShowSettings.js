// src/processors/util/ShowSettings.js
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'

/**
 * @class ShowSettings
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Logs a specific setting from the processor's configuration or RDF, primarily for debugging and inspection.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * Any configuration object; typically expects RDF properties like `ns.trn.name`
 *
 * #### __*Input*__
 * * **`message`** - The message object (any structure)
 *
 * #### __*Output*__
 * * **`message`** - The message object, unmodified
 *
 * #### __*Behavior*__
 * * Logs the value of a specific property (e.g., `ns.trn.name`) from config or RDF
 * * Emits the message unchanged
 *
 * #### __*Side Effects*__
 * * Console logging for inspection
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Add support for configurable property selection
 * * Add tests for various settings scenarios
 */

// probably not needed, see TestSetting
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

        const value = await super.getProperty(property)

        logger.debug(`ShowSettings.process, value  = ${value}`)

        return this.emit('message', message)
    }
}

export default ShowSettings
