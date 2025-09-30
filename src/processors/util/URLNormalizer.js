// src/processors/util/URLNormalizer.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'

/**
 * @class URLNormalizer
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Normalizes URLs by removing trailing slashes and optionally other normalizations.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.inputField`** - Field containing the URL to normalize (default: 'url')
 * * **`ns.trn.outputField`** - Field to store normalized URL (default: same as inputField)
 * * **`ns.trn.removeTrailingSlash`** - Remove trailing slash (default: true)
 *
 * #### __*Input*__
 * * **`message[inputField]`** - The URL string to normalize (supports nested paths like "resource.target")
 *
 * #### __*Output*__
 * * **`message[outputField]`** - The normalized URL (supports nested paths)
 *
 * #### __*Behavior*__
 * * Removes trailing slashes from URLs (e.g., "https://example.com/" → "https://example.com")
 * * Preserves the URL if it's just a domain with no path
 * * Skips processing if message.done is true
 *
 * #### __*Side Effects*__
 * * Modifies the specified message field
 *
 * #### __*Example Configuration*__
 * ```turtle
 * :normalizer a :URLNormalizer ;
 *     :settings :normConfig .
 *
 * :normConfig a :ConfigSet ;
 *     :inputField "url" ;
 *     :outputField "url" ;
 *     :removeTrailingSlash "true" .
 * ```
 */
class URLNormalizer extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug('URLNormalizer.process')

        // Skip processing if message is marked as done
        if (message.done) {
            logger.debug('URLNormalizer: Message marked as done, skipping')
            return this.emit('message', message)
        }

        const inputField = super.getProperty(ns.trn.inputField, 'url')
        const outputField = super.getProperty(ns.trn.outputField, inputField)
        const removeTrailingSlash = super.getProperty(ns.trn.removeTrailingSlash, 'true')

        // Use JSONUtils to support nested paths like "resource.target"
        const url = JSONUtils.get(message, inputField)

        if (!url) {
            logger.debug(`URLNormalizer: No URL found in field '${inputField}', skipping`)
            return this.emit('message', message)
        }

        logger.debug(`URLNormalizer: Input URL: ${url}`)

        let normalized = url

        // Remove trailing slash if enabled
        if (removeTrailingSlash === 'true' || removeTrailingSlash === true) {
            // Remove trailing slash, but keep it for root URLs (e.g., "https://example.com/")
            if (normalized.endsWith('/') && normalized.split('/').length > 3) {
                normalized = normalized.slice(0, -1)
            }
        }

        logger.debug(`URLNormalizer: Normalized URL: ${normalized}`)

        // Use JSONUtils to support nested paths
        JSONUtils.set(message, outputField, normalized)

        return this.emit('message', message)
    }
}

export default URLNormalizer