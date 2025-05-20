// src/processors/util/WhiteboardToMessage.js
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

/**
 * @class WhiteboardToMessage
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Aggregates values from a shared `whiteboard` array in the processor config and attaches them to the outgoing message as grouped properties.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`whiteboard`** - (array) Shared array of objects to aggregate
 *
 * #### __*Input*__
 * * **`message`** - The message object to augment with whiteboard data
 *
 * #### __*Output*__
 * * **`message`** - The message object with a new `whiteboard` property, grouping values by property name
 *
 * #### __*Behavior*__
 * * Iterates over the `whiteboard` array in config
 * * Groups values by property and attaches them as arrays to `message.whiteboard`
 * * Emits the updated message
 * * Logs key actions for debugging
 *
 * #### __*Side Effects*__
 * * Mutates the message object in place
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Add error handling for malformed whiteboard data
 * * Add tests for edge cases and large arrays
 */

class WhiteboardToMessage extends Processor {

    constructor(config) {
        super(config)
    }
    async process(message) {

        logger.debug('WhiteboardToMessage at [' + message.tags + '] ' + this.getTag())

        const originalArray = this.config.whiteboard

        message.whiteboard = Object.keys(originalArray).reduce((acc, key) => {
            const value = originalArray[key]
            if (value !== undefined && value !== null) {
                Object.keys(value).forEach((prop) => {
                    if (!acc[prop]) {
                        acc[prop] = []
                    }
                    acc[prop].push(value[prop])
                })
            }
            return acc
        }, {})

        return this.emit('message', message)
    }
}

export default WhiteboardToMessage
