// src/processors/util/ShowTransmission.js
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

/**
 * @class ShowTransmission
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Logs the string representation of the current transmission for debugging or inspection. Emits the message unchanged.
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
 * * Logs the string representation of the `transmission` property
 * * Emits the message unchanged
 *
 * #### __*Side Effects*__
 * * Console logging for inspection
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Add error handling if `transmission` is undefined
 * * Add tests for various transmission states
 */

class ShowTransmission extends Processor {

    async process(message) {
        logger.log(this.transmission.toString())
        return this.emit('message', message)
    }
}

export default ShowTransmission
