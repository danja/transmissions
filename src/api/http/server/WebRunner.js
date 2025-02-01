import express from 'express'
import cors from 'cors'
import path from 'path'
import ApplicationManager from '../../../core/ApplicationManager.js'
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
        // logger.setLogLevel('debug')
    }

    setupMiddleware() {
        const corsOptions = {
            origin: (origin, callback) => {
                if (!origin) return callback(null, true)
                if (origin.match(/^https?:\/\/localhost(:[0-9]+)?$/) ||
                    origin.match(/^https?:\/\/192\.168\.[0-9]+\.[0-9]+(:[0-9]+)?$/)) {
                    return callback(null, true)
                }
                callback(new Error('Origin not allowed'))
            },
            methods: ['GET', 'POST', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
            preflightContinue: false,
            optionsSuccessStatus: 204
        }
        this.app.use(cors(corsOptions))
        this.app.use(express.json())

        // Request logging
        this.app.use((req, res, next) => {
            this.requestCount++
            logger.info(`[${this.requestCount}] ${req.method} ${req.path}`)
            const start = Date.now()
            res.on('finish', () => {
                const duration = Date.now() - start
                logger.info(`[${this.requestCount}] ${res.statusCode} - ${duration}ms`)
            })
            next()
        })

        // JSON error handling
        this.app.use((err, req, res, next) => {
            if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
                logger.error(`Invalid JSON payload: ${err.message}`)
                return res.status(400).json({
                    success: false,
                    error: 'Invalid JSON payload',
                    details: err.message
                })
            }
            next(err)
        })
    }

    setupRoutes() {
        this.app.get('/favicon.ico', (req, res) => res.status(204).end())

        const router = express.Router()

        router.get('/', (req, res) => {
            try {
                res.json({
                    service: 'Transmissions API',
                    version: '1.0.0',
                    status: 'running',
                    uptime: process.uptime(),
                    requests: this.requestCount
                })
            } catch (error) {
                logger.error('Error in status endpoint:', error)
                res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                })
            }
        })

        router.get('/applications', async (req, res) => {
            try {
                const apps = await this.appManager.listApplications()
                logger.info(`Listed ${apps.length} applications`)
                res.json({
                    success: true,
                    applications: apps
                })
            } catch (error) {
                logger.error('Error listing applications:', error)
                res.status(500).json({
                    success: false,
                    error: error.message,
                    details: error.stack
                })
            }
        })

        router.post('/:application', async (req, res) => {
            const { application } = req.params
            const message = req.body || {}

            logger.info(`Running application: ${application}`)
            logger.debug('Message payload:', message)

            try {
                await this.appManager.initialize(application)
                const result = await this.appManager.start(message)

                const response = {
                    success: true,
                    data: result.whiteboard ?
                        result.whiteboard[result.whiteboard.length - 1] :
                        { message: "Transmission completed" }
                }

                logger.info(`Application ${application} completed successfully`)
                res.json(response)
            } catch (error) {
                logger.error(`Error running application ${application}:`, error)
                res.status(500).json({
                    success: false,
                    error: error.message,
                    details: error.stack,
                    application: application
                })
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