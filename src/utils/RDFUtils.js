// src/utils/RDFUtils.js
import { isBrowser } from './BrowserUtils.js'
import logger from './Logger.js'

class RDFUtils {
    static async readDataset(filename) {
        if (isBrowser()) {
            try {
                const response = await fetch(filename)
                if (!response.ok) {
                    throw new Error(`Failed to load dataset: ${filename}`)
                }
                const turtleText = await response.text()

                // Import browser-compatible RDF utils
                const rdfExt = await import('./browser-rdf-ext.js').then(m => m.default)
                return await rdfExt.parseTurtle(turtleText)
            } catch (error) {
                logger.error(`Error loading dataset in browser: ${error.message}`)
                throw error
            }
        } else {
            try {
                const rdfExt = await import('rdf-ext').then(m => m.default)
                const { fromFile } = await import('rdf-utils-fs')
                const stream = fromFile(filename)
                const dataset = await rdfExt.dataset().import(stream)
                return dataset
            } catch (error) {
                logger.error(`Error loading dataset in Node.js: ${error.message}`)
                throw error
            }
        }
    }

    static async writeDataset(dataset, filename) {
        if (isBrowser()) {
            try {
                // Use browser-compatible implementation
                const rdfExt = await import('./browser-rdf-ext.js').then(m => m.default)

                // Create a serializer
                const serializer = new rdfExt.SerializerTurtle()
                const quadStream = dataset.toStream()
                const textStream = serializer.import(quadStream)

                let turtleData = ''
                return new Promise((resolve, reject) => {
                    textStream.on('data', chunk => {
                        turtleData += chunk
                    })

                    textStream.on('end', () => {
                        // Create download link
                        const blob = new Blob([turtleData], { type: 'text/turtle' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = filename.split('/').pop() || 'dataset.ttl'
                        document.body.appendChild(a)
                        a.click()

                        setTimeout(() => {
                            document.body.removeChild(a)
                            URL.revokeObjectURL(url)
                        }, 0)

                        resolve()
                    })

                    textStream.on('error', reject)
                })
            } catch (error) {
                logger.error(`Error saving dataset in browser: ${error.message}`)
                throw error
            }
        } else {
            try {
                const { toFile } = await import('rdf-utils-fs')
                await toFile(dataset.toStream(), filename)
            } catch (error) {
                logger.error(`Error saving dataset in Node.js: ${error.message}`)
                throw error
            }
        }
    }

    static async loadDataset(relativePath) {
        try {
            let filePath

            if (isBrowser()) {
                filePath = relativePath
            } else {
                const { fileURLToPath } = await import('url')
                const nodePath = await import('path')
                const __filename = fileURLToPath(import.meta.url)
                const __dirname = nodePath.dirname(__filename)
                const rootDir = nodePath.resolve(__dirname, '../..')
                filePath = nodePath.join(rootDir, relativePath)
            }

            logger.debug(`Loading RDF dataset from: ${filePath}`)
            return await RDFUtils.readDataset(filePath)
        } catch (error) {
            logger.error(`Error loading dataset: ${error.message}`)
            logger.error(`Stack: ${error.stack}`)
            throw error
        }
    }
}

export default RDFUtils