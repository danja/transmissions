// src/processors/squirt/SquirtReceiver.js
/**
 * @class SquirtReceiver
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * SquirtReceiver processor demonstrating basic processor structure and property handling.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.me`** - Identifier for the processor instance
 * * **`ns.trn.common`** - Common value to be added to the message
 * * **`ns.trn.something1`** - First value to be processed
 * * **`ns.trn.something2`** - Second value to be processed
 * * **`ns.trn.added`** - Optional string to append to something1
 * * **`ns.trn.notavalue`** - Fallback value if not provided in config
 *
 * #### __*Input*__
 * * **`message`** - The message object to be processed
 *
 * #### __*Output*__
 * * **`message`** - The modified message object with added/updated fields
 *
 * #### __*Behavior*__
 * * Forwards message immediately if `message.done` is true
 * * Retrieves and processes configuration properties
 * * Appends optional values to message fields
 * * Handles fallback values for missing properties
 *
 * #### __*Side Effects*__
 * * Modifies the input message object
 * * Logs processing information
 *
 * #### __*Notes*__
 * This is an SquirtReceiver implementation demonstrating:
 *   - Basic processor structure
 *   - Property retrieval with fallbacks
 *   - Message modification
 *   - Logging
 *
 * Use this as a template when creating new processors.
 */

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'


class SquirtReceiver extends Processor {
    /**
     * Creates a new SquirtReceiver processor instance.
     * @param {Object} config - Processor configuration object
     */
    constructor(config) {
        super(config)
    }

    /**
     * Processes the message by applying property transformations.
     * @param {Object} message - The message to process
     * @returns {Promise<boolean>} Resolves when processing is complete
     */
    async process(message) {
        logger.debug(`\n\nSquirtReceiver.process`)

        // TODO figure this out better
        // may be needed if preceded by a spawning processor, eg. fs/DirWalker
        if (message.done) {
            return this.emit('message', message)
            // or simply return
        }

        // message is processed here :

        // property values pulled from message | config settings | fallback
        const me = super.getProperty(ns.trn.me)
        logger.log(`\nI am ${me}`)

        message.common = super.getProperty(ns.trn.common)
        message.something1 = super.getProperty(ns.trn.something1)

        message.something2 = super.getProperty(ns.trn.something2)

        var added = super.getProperty(ns.trn.added, '')
        message.something1 = message.something1 + added

        message.notavalue = super.getProperty(ns.trn.notavalue, 'fallback value')

        // message forwarded
        return this.emit('message', message)
    }
}
export default SquirtReceiver