// src/processors/util/ShowConfig.js
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

/**
 * @class ShowConfig
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Logs the processor's configuration and emits the message unchanged. Useful for debugging and inspection of processor configuration at runtime.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * Any configuration object passed to the processor
 *
 * #### __*Input*__
 * * **`message`** - The message object (any structure)
 *
 * #### __*Output*__
 * * **`message`** - The message object, unmodified
 *
 * #### __*Behavior*__
 * * Logs the processor instance and its configuration
 * * Emits the message unchanged
 *
 * #### __*Side Effects*__
 * * Console logging for inspection
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Add options to control log verbosity
 */

class ShowConfig extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {

        logger.log("***************************")
        logger.v(this)
        logger.log("***************************")
        return this.emit('message', message)
    }
}

export default ShowConfig
