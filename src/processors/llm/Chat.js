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
 * * **`ns.trn.provider`** - API provider (default: 'mistral')
 * * **`ns.trn.model`** - Model name (default: 'mistral-7b-instruct-v0.1')
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
import { createClient } from 'hyperdata-clients';
import Config from '../../engine/Config.js';

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
        const modelName = this.getProperty(ns.trn.model, 'open-codestral-mamba') // mistral-7b-instruct-v0.1


        // Get API key mapping from config
        const config = Config.getInstance();
        const apiKeyVars = config.get('API_KEYS') || {};

        // Get the appropriate API key from environment variables
        const apiKeyVar = apiKeyVars[provider] || 'MISTRAL_API_KEY';
        const apiKey = process.env[apiKeyVar];

        if (!apiKey) {
            throw new Error(`API key not found in environment variables. Please set ${apiKeyVar}`);
        }

        const clientOptions = {
            model: modelName,
            apiKey: apiKey
        }


        logger.debug(`    Using API: ${provider} `)
        logger.debug(`    Model: ${modelName} `)
        logger.debug(`    Prompt: ${message.content} `)

        //    const client = await clients.ClientFactory.createAPIClient(provider, clientOptions)
        const client = await createClient(provider, clientOptions)
        const prompt = message.content || "hello"
        const response = await client.chat([
            { role: 'user', content: prompt }
        ])

        logger.debug(`    Response: ${response} `)

        message.content = response

        // message forwarded
        return this.emit('message', message)
    }
}
export default Chat