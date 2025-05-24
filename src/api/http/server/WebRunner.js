import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import logger from '../../../utils/Logger.js'

/**
 * @typedef {Object} WebRunnerOptions
 * @property {number} [port=3000] - The port to run the server on
 * @property {string} [basePath='/'] - The base path for all routes
 * @property {boolean} [cors=false] - Whether to enable CORS
 */

/**
 * Web server for handling HTTP requests
 */
class WebRunner {
    /**
     * @param {any} [appManager] - The application manager
     * @param {WebRunnerOptions} [options] - Configuration options
     */
    constructor(appManager, options = {}) {
        /** @type {any} */
        this.appManager = appManager
        /** @type {import('express').Application} */
        this.app = express()
        /** @type {number} */
        this.port = options.port || 4000
        /** @type {string} */
        this.basePath = options.basePath || '/api'
        /** @type {import('http').Server|null} */
        this.server = null
        /** @type {number} */
        this.requestCount = 0

        this.setupMiddleware(options.cors)
        this.setupRoutes()
    }

    /**
     * Set up middleware for the Express app
     * @param {boolean} [enableCors=false] - Whether to enable CORS
     * @private
     */
    setupMiddleware(enableCors = false) {
        // CORS setup
        if (enableCors) {
            const corsOptions = {
                origin: (origin, callback) => {
                    if (!origin || origin.startsWith('http://localhost')) {
                        callback(null, true)
                    } else {
                        callback(new Error('Not allowed by CORS'))
                    }
                },
                methods: ['GET', 'POST', 'OPTIONS'],
                allowedHeaders: ['Content-Type'],
                credentials: true
            }
            this.app.use(cors(corsOptions))
        }

        // JSON body parsing
        this.app.use(express.json({
            limit: '10mb',
            strict: false,
            verify: (_, __, buf) => {
                try {
                    JSON.parse(buf.toString())
                } catch (/** @type {any} */ e) {
                    logger.error('Invalid JSON:', e.message || e)
                }
            }
        }))
    }

    /**
     * Set up routes for the Express app
     * @private
     */
    setupRoutes() {
        const router = express.Router()

        // Only set up API routes if we have an appManager
        if (this.appManager && typeof this.appManager.start === 'function') {
            router.post('/:application', async (req, res) => {
                const requestId = Math.random().toString(36).substring(7)
                const { application } = req.params
                const message = req.body || {}

                logger.info(`[${requestId}] Running application: ${application}`)
                logger.debug(`[${requestId}] Message payload:`, message)

                try {
                    // Check for graceful shutdown command
                    if (message && message.system === 'stop') {
                        logger.info(`[${requestId}] Graceful shutdown requested`)
                        res.json({
                            success: true,
                            requestId: requestId,
                            message: 'Shutdown initiated'
                        })
                        // Give time for response to be sent before shutting down
                        setTimeout(() => {
                            logger.info('Shutting down server gracefully...')
                            this.stop().then(() => process.exit(0))
                        }, 100)
                        return
                    }

                    if (!this.appManager) {
                        throw new Error('Application manager not initialized')
                    }
                    message.requestId = requestId
                    message.application = application
                    logger.debug(`[${requestId}] Starting application ${application} with message:`, message)
                    const result = await this.appManager.start(message)
                    if (!result) {
                        throw new Error('Application returned no result')
                    }
                    logger.debug(`[${requestId}] Application result:`, result)
                    const response = {
                        success: true,
                        requestId: requestId,
                        data: result
                    }
                    logger.info(`[${requestId}] Application ${application} completed successfully`)
                    res.json(response)

                } catch (error) {
                    const err = /** @type {Error} */ (error);
                    const errorResponse = {
                        success: false,
                        requestId: requestId,
                        error: err.message,
                        details: err.stack,
                        application: application
                    }
                    logger.log(`error = `)
                    logger.reveal(error)
                    logger.log(`errorResponse = `)
                    logger.reveal(errorResponse)
                    logger.error(`[${requestId}] Error running application ${application}:`, err.message)
                    logger.error(`[${requestId}] Stack:`, err.stack)
                    logger.debug(`[${requestId}] Context:`, {
                        application,
                        message,
                        headers: req.headers
                    })

                    res.status(500).json(errorResponse)
                }
            })

            this.app.use(this.basePath, router)
        }
    }

    /**
     * Start the web server
     * @returns {Promise<void>}
     */
    async start() {
        return new Promise((resolve, reject) => {
            try {
                this.server = createServer(this.app)
                this.server.listen(this.port, () => {
                    const endpoint = `http://localhost:${this.port}${this.basePath}`
                    const msg = `Transmissions API server running at ${endpoint}`
                    logger.info('\n' + '='.repeat(msg.length))
                    logger.info(msg)
                    logger.info('='.repeat(msg.length) + '\n')
                    resolve()
                })

                this.server.on('error', (error) => {
                    const err = /** @type {Error} */ (error)
                    logger.error('Server error:', err)
                    reject(err)
                })
            } catch (error) {
                const err = /** @type {Error} */ (error)
                logger.error('Failed to start server:', err)
                reject(err)
            }
        })
    }

    /**
     * Stop the web server
     * @returns {Promise<void>}
     */
    async stop() {
        return new Promise((resolve, reject) => {
            if (this.server) {
                logger.info('Shutting down server...')
                this.server.close((err) => {
                    if (err) {
                        const error = /** @type {Error} */ (err)
                        logger.error('Error shutting down server:', error)
                        reject(error)
                    } else {
                        logger.info('Server shutdown complete')
                        resolve()
                    }
                })
            } else {
                resolve()
            }
        })
    }
}

export { WebRunner as default }