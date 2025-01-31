import express from 'express'
import cors from 'cors'
import path from 'path'
import ApplicationManager from '../../../core/ApplicationManager.js'
import logger from '../../../utils/Logger.js'

class WebRunner {
    constructor(port = 4000, basePath = '/api') {
        this.appManager = new ApplicationManager()
        this.app = express()
        this.port = port
        this.basePath = basePath
        this.setupMiddleware()
        this.setupRoutes()
    }

    setupMiddleware() {
        this.app.use(cors({
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type']
        }))

        this.app.use(express.json())

        this.app.use((err, req, res, next) => {
            if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid JSON payload'
                })
            }
            next()
        })
    }

    setupRoutes() {
        this.app.get('/favicon.ico', (req, res) => res.status(204).end())

        const router = express.Router()

        router.get('/', (req, res) => {
            res.json({
                service: 'Transmissions API',
                version: '1.0.0',
                status: 'running'
            })
        })

        router.get('/applications', async (req, res) => {
            try {
                const apps = await this.appManager.listApplications()
                res.json({
                    success: true,
                    applications: apps
                })
            } catch (error) {
                logger.error('Error listing applications:', error)
                res.status(500).json({
                    success: false,
                    error: error.message
                })
            }
        })

        router.post('/:application', async (req, res) => {
            const { application } = req.params
            const message = req.body || {}

            try {
                await this.appManager.initialize(application)
                const result = await this.appManager.start(message)

                const response = {
                    success: true,
                    data: result.whiteboard ?
                        result.whiteboard[result.whiteboard.length - 1] :
                        { message: "Transmission completed" }
                }

                res.json(response)
            } catch (error) {
                logger.error('Error running application:', error)
                res.status(500).json({
                    success: false,
                    error: error.message
                })
            }
        })

        this.app.use(this.basePath, router)
    }

    start() {
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
            } catch (error) {
                reject(error)
            }
        })
    }

    stop() {
        return new Promise((resolve, reject) => {
            if (this.server) {
                this.server.close((err) => {
                    if (err) reject(err)
                    else resolve()
                })
            } else {
                resolve()
            }
        })
    }
}

export default WebRunner