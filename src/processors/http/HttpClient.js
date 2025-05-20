// src/processors/http/HttpClient.js

import logger from '../../utils/Logger.js' // path will likely change
import Processor from '../../model/Processor.js' // maybe more specific

/**
 * @class HttpClient
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Sends HTTP requests and processes responses as part of a Transmissions pipeline.
 *
 * ### Service Signature
 *
 * #### __*Settings*__
 * * **`ns.trm.url`** - The URL to send the HTTP request to
 * * **`ns.trm.method`** - HTTP method (GET, POST, etc.)
 * * **`ns.trm.headers`** (optional) - HTTP headers as an object
 * * **`ns.trm.body`** (optional) - Request body for POST/PUT
 *
 * #### __*Input*__
 * * **`message.url`** (if no `configKey`) - The URL to request
 * * **`message.method`** (if no `configKey`) - The HTTP method
 * * **`message.headers`** (optional) - Headers to include
 * * **`message.body`** (optional) - Body data
 *
 * #### __*Output*__
 * * **`message`** - The message object, augmented with the HTTP response
 *
 * #### __*Behavior*__
 * * Sends an HTTP request as specified in settings or message
 * * Attaches the HTTP response to the message object
 * * Emits a 'message' event with the processed message
 * * Logs request/response details for debugging
 *
 * #### __*Side Effects*__
 * * External HTTP requests
 *
 * #### __*Tests*__
 * * **`./run http-client-test`**
 * * **`npm test -- tests/integration/http-client.spec.js`**
 *
 * #### __*ToDo*__
 * - Add support for retries and error handling
 */
class HttpClient extends Processor {

    /**
     * Constructs a new ProcessorExample instance.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Does something with the message and emits a 'message' event with the processed message.
     * @param {Object} message - The message object.
     */
    async process(message) {
        //   logger.setLogLevel('debug')

        // processing goes here
        return this.emit('message', message)
    }
}

export default HttpClient