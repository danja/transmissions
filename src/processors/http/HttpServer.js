// src/processors/http/HttpServer.js

import path from 'path'
import { Worker } from 'worker_threads'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'

/**
 * @class HttpServer
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Hosts an HTTP server to receive and process incoming HTTP requests as part of a Transmissions pipeline.
 *
 * ### Service Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.port`** - Port to run the HTTP server on (default: 4000)
 * * **`ns.trn.basePath`** - Base path for the server (default: '/transmissions/test/')
 * * **`ns.trn.staticPath`** (optional) - Path to serve static files from
 * * **`ns.trn.cors`** (optional) - Enable CORS (default: false)
 * * **`ns.trn.timeout`** (optional) - Request timeout in ms (default: 30000)
 * * **`ns.trn.maxRequestSize`** (optional) - Max request size (default: '1mb')
 * * **`ns.trn.rateLimit`** (optional) - Rate limiting settings
 *
 * #### __*Input*__
 * * **HTTP request** - Incoming HTTP requests to the server
 *
 * #### __*Output*__
 * * **HTTP response** - Response sent back to the client
 * * **`message`** - The message object, possibly augmented with request data
 *
 * #### __*Behavior*__
 * * Starts an HTTP server on the configured port
 * * Receives and parses incoming HTTP requests
 * * Emits messages into the pipeline for each request
 * * Handles static file serving if configured
 * * Applies rate limiting, CORS, and request size restrictions as configured
 * * Logs server activity and requests for debugging
 *
 * #### __*Side Effects*__
 * * Opens a network port and listens for HTTP requests
 *
 * #### __*Tests*__
 * * **`./run http-server-test`**
 * * **`npm test -- tests/integration/http-server.spec.js`**
 *
 * #### __*ToDo*__
 * - Add support for HTTPS and advanced middleware
 */

class HttpServer extends Processor {
    constructor(config) {
        super(config)
        this.worker = null
        this.serverConfig = {
            port: this.getProperty(ns.trn.port) || 4000,
            basePath: this.getProperty(ns.trn.basePath) || '/transmissions/test/',
            staticPath: this.getProperty(ns.trn.staticPath),
            cors: this.getProperty(ns.trn.cors) || false,
            timeout: this.getProperty(ns.trn.timeout) || 30000,
            maxRequestSize: this.getProperty(ns.trn.maxRequestSize) || '1mb',
            rateLimit: {
                windowMs: 15 * 60 * 1000,
                max: 100
            }
        }
    }

    async process(message) {
        try {
            this.worker = new Worker(
                path.join(process.cwd(), 'src/processors/http/HttpServerWorker.js')
            )

            this.worker.on('message', (msg) => {
                switch (msg.type) {
                    case 'status':
                        if (msg.status === 'running') {
                            logger.info(`Server running on port ${msg.port}`)
                        } else if (msg.status === 'stopped') {
                            this.emit('message', { ...message, serverStopped: true })
                        }
                        break
                    case 'error':
                        logger.error(`Server error: ${msg.error}`)
                        this.emit('error', new Error(msg.error))
                        break
                }
            })

            this.worker.on('error', (error) => {
                logger.error(`Worker error: ${error}`)
                this.emit('error', error)
            })

            this.worker.postMessage({
                type: 'start',
                config: this.serverConfig
            })

            return new Promise((resolve) => {
                this.worker.on('exit', () => {
                    resolve(message)
                })
            })

        } catch (error) {
            logger.error(`Failed to start server: ${error}`)
            throw error
        }
    }

    async shutdown() {
        if (this.worker) {
            this.worker.postMessage({ type: 'stop' })
        }
    }
}

export default HttpServer