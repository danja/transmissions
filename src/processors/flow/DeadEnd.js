import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

// src/processors/flow/DeadEnd.js
/**
 * @class DeadEnd
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * A flow control processor that stops message processing and logs the message tags.
 *
 * ### Processor Signature
 *
 * #### __*Input*__
 * Any message with tags
 *
 * #### __*Output*__
 * None (message processing ends here)
 *
 * #### __*Behavior*__
 * * Logs the incoming message tags
 * * Stops further processing of the message
 *
 * #### __*Side Effects*__
 * * Logs message tags to the application logs
 */
class DeadEnd extends Processor {

    /**
     * Processes the message by logging its tags and stopping further processing.
     * @param {Object} message - The message object being processed
     * @param {Array} message.tags - Array of tags associated with the message
     * @returns {Promise<void>}
     */
    async process(message) {
        logger.log('DeadEnd at [' + message.tags + '] ' + this.getTag())
    }

}
export default DeadEnd
