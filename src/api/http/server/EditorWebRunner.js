import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'
import { exec } from 'child_process'
import WebRunner from './WebRunner.js'
import logger from '../../../utils/Logger.js'

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Root project directory
const projectRoot = path.resolve(__dirname, '../../../../')

class EditorWebRunner extends WebRunner {
    constructor(port = 9000) {
        super(null, port, '') // No appManager, use root as base path
        this.port = port
    }

    async setupEditor() {
        // Check if dist directory exists, if not build the editor
        const distPath = path.join(projectRoot, 'dist')
        if (!existsSync(distPath)) {
            logger.info('Editor build not found, building now...')
            await this.buildEditor()
        } else {
            logger.debug('Editor dist directory exists')
        }
    }
    
    /**
     * Build the editor using webpack
     */
    async buildEditor() {
        return new Promise((resolve, reject) => {
            logger.info('Building the editor...')
            exec('npm run build:dev', { cwd: projectRoot }, (error, stdout, stderr) => {
                if (error) {
                    logger.error('Error building editor:', error)
                    return reject(error)
                }
                if (stderr) {
                    logger.debug('Webpack build stderr:', stderr)
                }
                logger.debug('Webpack build stdout:', stdout)
                logger.info('Editor built successfully')
                resolve()
            })
        })
    }

    setupMiddleware() {
        super.setupMiddleware() // Set up CORS and JSON parsing
        
        // Serve static files from the dist directory
        const distPath = path.join(projectRoot, 'dist')
        this.app.use(express.static(distPath))
    }

    setupRoutes() {
        // Override the parent method to avoid setting up API routes
        
        // Handle all routes by serving index.html for client-side routing
        this.app.get('*', (req, res) => {
            const distPath = path.join(projectRoot, 'dist')
            res.sendFile(path.join(distPath, 'index.html'))
        })
    }

    async start() {
        // First make sure the editor is built
        await this.setupEditor()
        
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(this.port, () => {
                    const endpoint = `http://localhost:${this.port}`
                    const msg = `Transmissions Editor running at ${endpoint}`
                    logger.info('\n' + '='.repeat(msg.length))
                    logger.info(msg)
                    logger.info('='.repeat(msg.length) + '\n')
                    
                    // Open browser
                    this.openBrowser(endpoint)
                    
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
     * @param {string} url - The URL to open
     */
    openBrowser(url) {
        const platform = process.platform
        
        try {
            logger.debug(`Opening browser on ${platform} to ${url}`)
            
            let command
            switch (platform) {
                case 'darwin': // macOS
                    command = `open ${url}`
                    break
                case 'win32': // Windows
                    command = `start ${url}`
                    break
                default: // Linux and others
                    command = `xdg-open ${url}`
            }
            
            exec(command, (error) => {
                if (error) {
                    logger.error(`Failed to open browser: ${error.message}`)
                    logger.info(`Please open ${url} manually in your browser`)
                }
            })
        } catch (error) {
            logger.error(`Error opening browser: ${error.message}`)
            logger.info(`Please open ${url} manually in your browser`)
        }
    }
}

export default EditorWebRunner