// src/processors/squirt/SquirtReceiver.js
/**
 * @class SquirtReceiver
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * SquirtReceiver processor for receiving URLs from bookmarklets and web requests.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.me`** - Identifier for the processor instance
 * * **`ns.trn.appName`** - Application name
 * * **`ns.trn.description`** - Description of the processor
 *
 * #### __*Input*__
 * * **`message.url`** - URL to be processed (from bookmarklet or API request)
 * * **`message.title`** - Page title (optional, from bookmarklet)
 * * **`message`** - The message object to be processed
 *
 * #### __*Output*__
 * * **`message`** - The modified message object with processed URL data
 *
 * #### __*Behavior*__
 * * Forwards message immediately if `message.done` is true
 * * Extracts and validates URL from message
 * * Processes URL and adds metadata to message
 * * Logs URL processing information
 *
 * #### __*Side Effects*__
 * * Modifies the input message object
 * * Logs URL processing information
 *
 * #### __*Notes*__
 * This processor is designed to work with the Squirt bookmarklet system:
 *   - Receives URLs from browser bookmarklets
 *   - Validates and processes URL data
 *   - Adds URL metadata to the message
 *   - Suitable for URL bookmarking and processing workflows
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
     * Processes the message by extracting and validating URL data.
     * @param {Object} message - The message to process
     * @returns {Promise<boolean>} Resolves when processing is complete
     */
    async process(message) {
        logger.debug(`\n\nSquirtReceiver.process`)

        // may be needed if preceded by a spawning processor, eg. fs/DirWalker
        if (message.done) {
            return this.emit('message', message)
        }

        // Get processor identity
        const me = super.getProperty(ns.trn.me)
        const appName = super.getProperty(ns.trn.appName, 'Squirt')
        logger.log(`\n${appName} processor: ${me}`)

        // Extract URL from message (could come from bookmarklet or API request)
        const url = message.url
        const title = message.title || ''

        if (!url) {
            logger.error('No URL provided in message')
            message.error = 'No URL provided'
            return this.emit('message', message)
        }

        // Basic URL validation
        try {
            const urlObj = new URL(url)
            message.processedUrl = {
                url: url,
                title: title,
                hostname: urlObj.hostname,
                protocol: urlObj.protocol,
                pathname: urlObj.pathname,
                receivedAt: new Date().toISOString()
            }
            
            logger.log(`Processed URL: ${url}`)
            logger.log(`Title: ${title}`)
            logger.log(`Hostname: ${urlObj.hostname}`)
            
            message.success = true
        } catch (error) {
            logger.error(`Invalid URL: ${url}`, error.message)
            message.error = `Invalid URL: ${error.message}`
            message.success = false
        }

        // message forwarded
        return this.emit('message', message)
    }
}
export default SquirtReceiver