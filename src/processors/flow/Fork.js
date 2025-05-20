import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

// src/processors/flow/Fork.js
/**
 * @class Fork
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Creates multiple copies of a message for parallel processing.
 *
 * ### Processor Signature
 *
 * #### __*Input*__
 * * **`message`** - The message to be forked
 * * **`message.nForks`** - Number of message copies to create (default: 2)
 *
 * #### __*Output*__
 * * **`message`** - Original message with `done=true` flag
 * * **`message`** - Multiple copies of the message with `forkN` property indicating the fork number
 *
 * #### __*Behavior*__
 * * Creates specified number of message clones
 * * Adds `forkN` property to each clone to identify the fork number
 * * Emits each cloned message individually
 * * Emits the original message with `done=true` to signal completion
 *
 * #### __*Side Effects*__
 * * Creates multiple message objects in memory
 * * Logs debug information during processing
 *
 * #### __*Tests*__
 * * Primarily used for system testing
 * * TODO: Add comprehensive test coverage
 *
 * @note This is a basic implementation primarily for system testing purposes.
 */
class Fork extends Processor {

    /**
     * Creates a new Fork processor instance.
     * @param {Object} config - Processor configuration object
     */
    constructor(config) {
        super(config)
    }

    /**
     * Processes the message by creating multiple copies for parallel processing.
     * @param {Object} message - The message to be forked
     * @param {number} [message.nForks=2] - Number of message copies to create
     * @returns {Promise<void>}
     */
    async process(message) {
        const nForks = message.nForks || 2

        logger.debug('forks = ' + nForks)

        for (let i = 0; i < nForks; i++) {
            var messageClone = structuredClone(message)
            messageClone.forkN = i
            logger.debug('--- emit --- ' + i)
            this.emit('message', messageClone)
        }

        message.done = true // one extra to flag completion

        return this.emit('message', message)
        //   return this.getOutputs()
    }

}

export default Fork
