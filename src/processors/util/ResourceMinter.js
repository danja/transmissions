// src/processors/example-group/ResourceMinter.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'

/**
 * @class ResourceMinter
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * ResourceMinter processor demonstrating basic processor structure and property handling.
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
 * This is an example implementation demonstrating:
 *   - Basic processor structure
 *   - Property retrieval with fallbacks
 *   - Message modification
 *   - Logging
 *
 * Use this as a template when creating new processors.
 */
class ResourceMinter extends Processor {
    /**
     * Creates a new ResourceMinter processor instance.
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
        logger.debug(`\n\nResourceMinter.process`)

        // TODO figure this out better
        // may be needed if preceded by a spawning processor, eg. fs/DirWalker
        if (message.done) {
            return this.emit('message', message)
            // or simply return
        }

        const targetField = super.getProperty(ns.trn.targetField, 'content')
        const baseURI = super.getProperty(ns.trn.baseURI, 'http://purl.org/stuff/instance/')
        const agentURI = super.getProperty(ns.trn.agentURI, 'http://purl.org/stuff/agent/transmissions')

        const randomId = Math.random().toString(36).substring(2, 10)

        message[targetField] = {}
        message[targetField].uri = `${baseURI}${randomId}`
        message[targetField].created = new Date().toISOString()
        message[targetField].agent = agentURI

        // message forwarded
        return this.emit('message', message)
    }
}

export default ResourceMinter