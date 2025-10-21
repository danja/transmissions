// src/processors/http/HttpClient.js

import logger from '../../utils/Logger.js' // path will likely change
import Processor from '../../model/Processor.js' // maybe more specific
import fetch from 'node-fetch'
import ns from '../../utils/ns.js'

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
 * * **`ns.trn.url`** - The URL to send the HTTP request to
 * * **`ns.trn.method`** - HTTP method (GET, POST, etc.)
 * * **`ns.trn.headers`** (optional) - HTTP headers as an object
 * * **`ns.trn.body`** (optional) - Request body for POST/PUT
 * * **`ns.trn.timeout`** (optional) - Request timeout in milliseconds (default: 30000)
 *
 * #### __*Input*__
 * * **`message.url`** (if no `configKey`) - The URL to request
 * * **`message.method`** (if no `configKey`) - The HTTP method
 * * **`message.headers`** (optional) - Headers to include
 * * **`message.body`** (optional) - Body data
 *
 * #### __*Output*__
 * * **`message.http`** - The HTTP response object with status, headers, and data
 * * **`message.httpError`** - Error message if request fails (timeout, network error, etc.)
 *
 * #### __*Behavior*__
 * * Sends an HTTP request as specified in settings or message
 * * Implements timeout using AbortController to prevent hanging on slow/unresponsive URLs
 * * On timeout or error, sets `message.httpError` and continues processing
 * * Attaches the HTTP response to `message.http`
 * * Emits a 'message' event with the processed message
 * * Logs request/response details for debugging
 *
 * #### __*Side Effects*__
 * * External HTTP requests
 * * Requests may timeout and be aborted after configured duration
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
     * Sends an HTTP request and emits a 'message' event with the processed message.
     * @param {Object} message - The message object.
     */
    async process(message) {
        try {
            const requestOptions = this._buildRequestOptions(message)
            logger.debug(`HttpClient: Sending request to ${requestOptions.url} with options: ${JSON.stringify(requestOptions)}`)

            const response = await this._sendRequest(requestOptions)
            const processedResponse = await this._processResponse(response, requestOptions.method)

            message.http = processedResponse
            logger.debug(`HttpClient: Received response with status ${response.status}`)

            this.emit('message', message)
        } catch (err) {
            logger.error(`HttpClient: Error during HTTP request - ${err.message}`)
            message.httpError = err.message
            this.emit('message', message)
        }
    }

    /**
     * Builds the HTTP request options from config and message.
     * @param {Object} message
     * @returns {Object} requestOptions
     */
    _buildRequestOptions(message) {
        const url = super.getProperty(ns.trn.url, "https://example.org/")
        const method = super.getProperty(ns.trn.method, 'GET').toUpperCase()
        const headers = super.getProperty(ns.trn.headers, {})
        const body = super.getProperty(ns.trn.body, null)
        const timeout = super.getProperty(ns.trn.timeout, 30000) // Default 30s timeout

        const options = { method, headers }

        // Add timeout using AbortController
        if (timeout) {
            const controller = new AbortController()
            options.signal = controller.signal
            options.controller = controller
            options.timeout = parseInt(timeout)
        }

        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = typeof body === 'string' ? body : JSON.stringify(body)
            if (!headers['Content-Type']) {
                options.headers['Content-Type'] = 'application/json'
            }
        }

        return { url, ...options }
    }

    /**
     * Sends the HTTP request using fetch.
     * @param {Object} requestOptions
     * @returns {Promise<Response>}
     */
    async _sendRequest(requestOptions) {
        const { url, timeout, controller, ...options } = requestOptions

        // Handle timeout
        if (timeout && controller) {
            const timeoutId = setTimeout(() => {
                controller.abort()
            }, timeout)

            try {
                const response = await fetch(url, options)
                clearTimeout(timeoutId)
                return response
            } catch (error) {
                clearTimeout(timeoutId)
                throw error
            }
        }

        return fetch(url, options)
    }

    /**
     * Processes the HTTP response.
     * @param {Response} response
     * @param {string} method - HTTP method used
     * @returns {Promise<Object>} Processed response data
     */
    async _processResponse(response, method) {
        const contentType = response.headers.get('content-type') || ''
        let data = ''

        // HEAD requests don't have a body, skip reading it
        if (method !== 'HEAD') {
            if (contentType.includes('application/json')) {
                data = await response.json()
            } else {
                data = await response.text()
            }
        }

        return {
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('content-type') || '',
            headers: Object.fromEntries(response.headers.entries()),
            data
        }
    }
}

export default HttpClient