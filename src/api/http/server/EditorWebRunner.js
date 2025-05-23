import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'
import { exec } from 'child_process'
import WebRunner from './WebRunner.js'
import logger from '../../../utils/Logger.js'

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../../')

/**
 * Web server for the editor interface
 */
class EditorWebRunner extends WebRunner {
    /**
     * @param {number} [port=9000] - The port to run the editor on
     */
    constructor(port = 9000) {
        super(null, {
            port,
            basePath: '/',
            cors: true
        })

        // Override the server property with correct type
        /** @type {import('http').Server|null} */
        this.server = null
        
        // Clear any inherited routes and start fresh for the editor
        this.app = express()
        this.setupMiddleware(true) // Enable CORS for editor
    }

    /**
     * Set up the editor environment
     * @returns {Promise<void>}
     */
    async setupEditor() {
        logger.setLogLevel('debug')
        console.log('EditorWebRunner.setupEditor')
        try {
            // Build the editor if not already built
            await this.buildEditor()

            // Set up static file serving
            const distPath = path.join(projectRoot, 'dist')
            console.log(`Serving static files from: ${distPath}`)

            if (!existsSync(distPath)) {
                const errorMsg = `Distribution directory not found at ${distPath}`
                logger.error(errorMsg)
                throw new Error(errorMsg)
            }

            // Log contents of dist directory
            const distContents = fs.readdirSync(distPath)
            console.log('Dist directory contents:')
            console.log(distContents)

            // Set up static file serving
            this.app.use(express.static(distPath, {
                maxAge: '1d',
                setHeaders: (res, filePath) => {
                    if (filePath.endsWith('.html')) {
                        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
                    }
                }
            }))

            // Handle root route - serve index.html
            this.app.get('/', (_req, res) => {
                const indexPath = path.join(distPath, 'index.html')
                if (!existsSync(indexPath)) {
                    return res.status(404).send('Editor not found. Please build the editor first.')
                }
                res.sendFile(indexPath)
            })
            
            // Handle other routes with a fallback
            this.app.use((_req, res) => {
                const indexPath = path.join(distPath, 'index.html')
                if (!existsSync(indexPath)) {
                    return res.status(404).send('Editor not found. Please build the editor first.')
                }
                res.sendFile(indexPath)
            })

            // Start the server
            await this.start()

            // Open browser
            const url = `http://localhost:${this.port}`
            this.openBrowser(url)

        } catch (error) {
            console.error('Error setting up editor:', error)
            logger.error('Error setting up editor:', error)
            throw error
        }
    }

    /**
     * Build the editor using webpack
     * @returns {Promise<void>}
     */
    async buildEditor() {
        return new Promise((resolve, reject) => {
            logger.info('Building the editor...')
            exec('npm run build', { cwd: projectRoot }, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error building editor:', error)
                    logger.error('Error building editor:', error)
                    return reject(error)
                }
                if (stderr) {
                    console.log('Webpack build stderr:', stderr)
                    logger.debug('Webpack build stderr:', stderr)
                }
                if (stdout) {
                    console.log('Webpack build stdout:', stdout)
                }
                logger.info('Editor built successfully')
                resolve()
            })
        })
    }

    /**
     * Start the web server
     * @returns {Promise<void>}
     */
    async start() {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(this.port, () => {
                    const endpoint = `http://localhost:${this.port}`
                    logger.info(`\n========================================`)
                    logger.info(`Transmissions Editor running at ${endpoint}`)
                    logger.info(`========================================\n`)
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

    /**
     * Open the browser to the specified URL
     * 
     * @param {string} url - The URL to open in the browser
     * @returns {void}
     */
    openBrowser(url) {
        const platform = process.platform
        let command

        switch (platform) {
            case 'darwin': command = `open "${url}"`; break
            case 'win32': command = `start "" "${url}"`; break
            case 'linux': command = `xdg-open "${url}"`; break
            default:
                logger.warn(`Unsupported platform for opening browser: ${platform}`)
                return
        }

        exec(command, (error) => {
            if (error) {
                logger.error(`Failed to open browser: ${error.message}`)
            } else {
                logger.info(`Opened browser to: ${url}`)
            }
        })
    }

    /**
     * Stop the web server
     * @returns {Promise<void>}
     */
    async stop() {
        if (!this.server) return Promise.resolve()

        return new Promise((resolve, reject) => {
            if (!this.server) {
                return resolve()
            }
            this.server.close((error) => {
                if (error) {
                    logger.error('Error shutting down server:', error)
                    reject(error)
                } else {
                    logger.info('Server shutdown complete')
                    resolve()
                }
            })
        })
    }
}

export default EditorWebRunner