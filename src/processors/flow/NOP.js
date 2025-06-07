import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'

// src/processors/flow/NOP.js
/**
 * @class NOP
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * A No-Operation processor that passes messages through without modification.
 * Primarily used for testing, debugging, and as a placeholder in processor chains.
 *
 * ### Processor Signature
 *
 * #### __*Input*__
 * * **`message`** - Any message object
 *
 * #### __*Output*__
 * * **`message`** - The same message object, unmodified
 *
 * #### __*Behavior*__
 * * Logs debug information about the message
 * * Optionally tests property retrieval if configured
 * * Forwards the message unchanged
 *
 * #### __*Settings*__
 * * **`ns.trn.test`** - Optional test property (default: "TEST_FAILED")
 *
 * #### __*Side Effects*__
 * * Logs debug information when processing messages
 *
 * @example
 * // Basic usage
 * const nop = new NOP({});
 * await nop.process({ some: 'data' });
 */
class NOP extends Processor {

    /**
     * Creates a new NOP processor instance.
     * @param {Object} config - Processor configuration object
     */
    constructor(config) {
        super(config)
    }

    /**
     * Processes the message by logging debug information and forwarding it unchanged.
     * @param {Object} message - The message to process
     * @returns {Promise<boolean>} Resolves to the result of emitting the message
     */
    async process(message) {
        const done = message.done ? `done = true` : `done = false`

        logger.debug(`\nNOP at [${message.tags}] ${this.getTag()} (${done})`)
        const test = await super.getProperty(ns.trn.test, null)
        if (test) {
            logger.log(test)
        }
        // logger.log(this)

        return this.emit('message', message)
    }

    /**
     * Utility method that doubles the input string (for testing only).
     * @param {string} string - The input string to double
     * @returns {string} The input string concatenated with itself
     * @private
     */
    double(string) {
        return string + string
    }
}
export default NOP
