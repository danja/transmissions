import { Worker } from 'worker_threads'
import path from 'path'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'

// src/processors/flow/Ping.js
/**
 * @class Ping
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * A processor that sends periodic ping messages using a worker thread.
 * Can be controlled via messages and supports automatic retries on failure.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.interval`** - Time between pings in ms (default: 5000)
 * * **`ns.trn.count`** - Number of pings to send (0 = infinite) (default: 0)
 * * **`ns.trn.payload`** - Payload to send with each ping (default: 'ping')
 * * **`ns.trn.killSignal`** - Signal to stop the worker (default: 'STOP')
 * * **`ns.trn.retryAttempts`** - Number of retry attempts on failure (default: 3)
 * * **`ns.trn.retryDelay`** - Delay between retries in ms (default: 1000)
 *
 * #### __*Input*__
 * * **`message`** - Any message object
 * * **`message.kill`** - If matches `killSignal`, stops the worker
 *
 * #### __*Output*__
 * * **`message`** - Original message with ping status updates
 * * **`message.ping`** - Added when ping is sent (contains count, timestamp, payload, status)
 * * **`message.pingComplete`** - Added when pinging completes
 * * **`message.pingStatus`** - Set to 'stopped' when worker is stopped
 *
 * #### __*Behavior*__
 * * Starts a worker thread for sending pings
 * * Handles worker errors with automatic retries
 * * Emits ping status updates as messages
 * * Can be gracefully stopped via kill signal
 * * Automatically cleans up resources on exit
 *
 * #### __*Side Effects*__
 * * Creates a worker thread
 * * Sends periodic ping messages
 * * Modifies the message object with ping status
 *
 * @example
 * // Start pinging
 * const ping = new Ping({});
 * await ping.process({ some: 'data' });
 *
 * // Stop pinging
 * await ping.process({ kill: 'STOP' });
 */
class Ping extends Processor {
    /**
     * Creates a new Ping processor instance.
     * @param {Object} config - Processor configuration object
     */
    constructor(config) {
        super(config)
        /** @private */
        this.worker = null
        /** @private */
        this.pingConfig = {
            interval: this.getProperty(ns.trn.interval) || 5000,
            count: this.getProperty(ns.trn.count) || 0,
            payload: this.getProperty(ns.trn.payload) || 'ping',
            killSignal: this.getProperty(ns.trn.killSignal) || 'STOP',
            retryAttempts: this.getProperty(ns.trn.retryAttempts) || 3,
            retryDelay: this.getProperty(ns.trn.retryDelay) || 1000
        }
    }

    /**
     * Processes the message and manages the ping worker.
     * @param {Object} message - The message to process
     * @returns {Promise<Object>} Resolves with the processed message
     * @throws {Error} If ping worker fails to start
     */
    async process(message) {
        try {
            // Check for kill signal in incoming message
            if (message.kill === this.pingConfig.killSignal) {
                await this.shutdown()
                return this.emit('message', {
                    ...message,
                    pingStatus: 'stopped',
                    timestamp: Date.now()
                })
            }

            if (this.worker) {
                logger.warn('Ping worker already running, ignoring start request')
                return
            }

            let retryCount = 0
            const startWorker = async () => {
                try {
                    this.worker = new Worker(
                        path.join(process.cwd(), 'src/processors/flow/PingWorker.js')
                    )

                    this.worker.on('message', (msg) => {
                        switch (msg.type) {
                            case 'ping':
                                this.emit('message', {
                                    ...message,
                                    ping: {
                                        count: msg.count,
                                        timestamp: msg.timestamp,
                                        payload: msg.payload,
                                        status: 'running'
                                    }
                                })
                                break
                            case 'complete':
                                this.emit('message', {
                                    ...message,
                                    pingComplete: true,
                                    timestamp: Date.now()
                                })
                                break
                            case 'error':
                                this.handleWorkerError(msg.error, startWorker, retryCount)
                                break
                        }
                    })

                    this.worker.on('error', (error) => {
                        this.handleWorkerError(error, startWorker, retryCount)
                    })

                    this.worker.on('exit', (code) => {
                        if (code !== 0) {
                            this.handleWorkerError(
                                new Error(`Worker stopped with exit code ${code}`),
                                startWorker,
                                retryCount
                            )
                        }
                        this.worker = null
                    })

                    this.worker.postMessage({
                        type: 'start',
                        config: this.pingConfig
                    })

                } catch (error) {
                    this.handleWorkerError(error, startWorker, retryCount)
                }
            }

            await startWorker()

            return new Promise((resolve) => {
                this.worker.on('exit', () => {
                    resolve(message)
                })
            })

        } catch (error) {
            logger.error(`Failed to start ping processor: ${error}`)
            throw error
        }
    }

    /**
     * Handles worker errors with automatic retry logic.
     * @param {Error} error - The error that occurred
     * @param {Function} retryFn - Function to retry worker creation
     * @param {number} retryCount - Current retry attempt number
     * @private
     */
    async handleWorkerError(error, retryFn, retryCount) {
        logger.error(`Ping worker error: ${error}`)

        if (retryCount < this.pingConfig.retryAttempts) {
            retryCount++
            logger.info(`Retrying ping worker (attempt ${retryCount}/${this.pingConfig.retryAttempts})`)
            setTimeout(retryFn, this.pingConfig.retryDelay)
        } else {
            logger.error('Max retry attempts reached, stopping ping worker')
            this.emit('error', error)
            await this.shutdown()
        }
    }

    /**
     * Gracefully shuts down the ping worker.
     * @returns {Promise<void>}
     */
    async shutdown() {
        if (this.worker) {
            this.worker.postMessage({ type: 'stop' })
            this.worker = null
        }
    }
}

export default Ping
