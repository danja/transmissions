import express from 'express'
import cors from 'cors'
import path from 'path'
import ApplicationManager from '../../../engine/ApplicationManager.js'
import logger from '../../../utils/Logger.js'

class WebRunner {
    constructor(appManager, port = 4000, basePath = '/api') {
        this.appManager = appManager
        this.app = express()
        this.port = port
        this.basePath = basePath
        this.setupMiddleware()
        this.setupRoutes()
        this.requestCount = 0
    }

    setupMiddleware() {
        // CORS setup
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

        // JSON body parsing
        this.app.use(express.json({
            limit: '10mb',
            strict: false,
            verify: (req, res, buf) => {
                try {
                    JSON.parse(buf)
                } catch (e) {
                    logger.error('Invalid JSON:', e)
                }
            }
        }))
    }

    setupRoutes() {
        const router = express.Router()

        router.post('/:application', async (req, res) => {
            const requestId = Math.random().toString(36).substring(7)
            const { application } = req.params
            const message = req.body || {}

            logger.info(`[${requestId}] Running application: ${application}`)
            logger.debug(`[${requestId}] Message payload:`, message)

            try {
                if (!this.appManager) {
                    throw new Error('Application manager not initialized')
                }
                logger.debug(`[${requestId}] Initializing application ${application}`)
                await this.appManager.initialize(application)
                message.requestId = requestId
                logger.debug(`[${requestId}] Starting application with message:`, message)
                const result = await this.appManager.start(message)
                if (!result) {
                    throw new Error('Application returned no result')
                }
                logger.debug(`[${requestId}] Application result:`, result)
                const response = {
                    success: true,
                    requestId: requestId,

                    data: result
                    /*result.whiteboard ?
                        result.whiteboard[result.whiteboard.length - 1] :
                        { message: "Echo response" }
                */
                }
                logger.info(`[${requestId}] Application ${application} completed successfully`)
                res.json(response)

            } catch (error) {
                const errorResponse = {
                    success: false,
                    requestId: requestId,
                    error: error.message,
                    details: error.stack,
                    application: application
                }
                logger.log(`error = `)
                logger.reveal(error)
                logger.log(`errorResponse = `)
                logger.reveal(errorResponse)
                logger.error(`[${requestId}] Error running application ${application}:`, error)
                logger.error(`[${requestId}] Stack:`, error.stack)
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

    async start() {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(this.port, () => {
                    const endpoint = `http://localhost:${this.port}${this.basePath}`
                    const msg = `Transmissions API server running at ${endpoint}`
                    logger.info('\n' + '='.repeat(msg.length))
                    logger.info(msg)
                    logger.info('='.repeat(msg.length) + '\n')
                    resolve()
                })

                this.server.on('error', (error) => {
                    logger.error('Server error:', error)
                    reject(error)
                })
            } catch (error) {
                logger.error('Failed to start server:', error)
                reject(error)
            }
        })
    }

    async stop() {
        return new Promise((resolve, reject) => {
            if (this.server) {
                logger.info('Shutting down server...')
                this.server.close((err) => {
                    if (err) {
                        logger.error('Error shutting down server:', err)
                        reject(err)
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

export default WebRunner