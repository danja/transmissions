// src/processors/example-group/Chat.js
/**
 * @class Chat
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Chat processor demonstrating basic processor structure and property handling.
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

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import dotenv from 'dotenv'


// Load environment variables from .env file
dotenv.config()

class Chat extends Processor {
    /**
     * Creates a new Chat processor instance.
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
        logger.debug(`\n\n[Chat.process]`)

        const provider = this.getProperty(ns.trn.provider, 'mistral')
        const modelName = this.getProperty(ns.trn.model, 'mistral-7b-instruct-v0.1')
        const clientOptions = {
            model: modelName
        }

        logger.debug(`    Using API: ${provider}`)
        logger.debug(`    Model: ${modelName}`)
        logger.debug(`    Prompt: ${message.content}`)

        // Create client using environment variables for API key
        const client = await ClientFactory.createAPIClient(provider, clientOptions)
        const response = await client.chat([
            { role: 'user', content: message.content }
        ])

        message.content = response.content

        // message forwarded
        return this.emit('message', message)
    }
}
export default Chat