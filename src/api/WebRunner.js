// src/web/WebRunner.js
import express from 'express'

import ApplicationManager from './ApplicationManager.js'
import logger from '../utils/Logger.js'

class WebRunner {
    constructor(appsDir, port = 7247) { // was  3000
        this.appManager = new ApplicationManager(appsDir)
        //  this.runner = new TransmissionRunner()
        this.app = express()
        this.port = port

        this.setupRoutes()
    }

    setupRoutes() {
        this.app.use(express.json())

        this.app.get('/applications', async (req, res) => {
            const apps = await this.appManager.listApplications()
            res.json(apps)
        })

        this.app.post('/run/:application', async (req, res) => {
            const { application } = req.params
            const { target, message } = req.body

            try {
                const config = await this.appManager.getApplicationConfig(application)
                await this.appManager.initialize(config.modulePath)

                const result = await this.appManager.run({
                    ...config,
                    message,
                    target
                })

                res.json(result)
            } catch (error) {
                logger.error('Error running application:', error)
                res.status(500).json({
                    success: false,
                    error: error.message
                })
            }
        })
    }

    start() {
        this.app.listen(this.port, () => {
            logger.log(`Web interface running on port ${this.port}`)
        })
    }
}

export default WebRunner
