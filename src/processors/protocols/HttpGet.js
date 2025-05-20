// src/processors/protocols/HttpGet.js

// TODO - remove 
/**
 * @class HttpGet
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Retrieves content from HTTP URLs using GET requests.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * None specific (may use config for headers, timeouts, etc.)
 *
 * #### __*Input*__
 * * **`url`** - The HTTP URL to fetch content from
 * * **`message`** - Message object to be enriched with response data
 *
 * #### __*Output*__
 * * **`message`** - Original message with added `sourceURL` property
 * * **`content`** - The retrieved content from the URL
 *
 * #### __*Behavior*__
 * * Fetches content from specified HTTP URL
 * * Adds source URL to message object
 * * Handles special '~~done~~' URL marker
 * * Emits retrieved content along with enriched message
 * * Logs detailed debug information during operation
 *
 * #### __*Side Effects*__
 * * Network requests (HTTP GET)
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Add support for custom headers and timeouts
 * * Add error handling tests
 */

import axios from 'axios'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

class HttpGet extends Processor {
    constructor(config) {
        super(config)
    }

    /**
     * Processes an HTTP GET request for the given URL
     * @param {string} url - Target URL to fetch
     * @param {Object} message - Message object to enrich with response data
     * @emits message - Emits retrieved content and enriched message
     */
    async process(url, message) {
        //   logger.setLogLevel('debug')
        logger.debug('HttpGet, url = ' + url)
        if (url === '~~done~~') {
            logger.log('HG DONE*****************')
            return this.emit('message', url, message)
            return
        }
        try {
            logger.log('HG GETTING*****************')
            const response = await axios.get(url)
            const content = response.data

            message.sourceURL = url
            return this.emit('message', content, message)
        } catch (error) {
            logger.error("HttpGet.execute error\n" + error)
        }
    }
}

export default HttpGet