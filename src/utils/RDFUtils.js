import rdfExt from './browser-rdf-ext.js'
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
                return await rdfExt.parseTurtle(turtleText)
            } catch (error) {
                logger.error(`Error loading dataset in browser: ${error.message}`)
                throw error
            }
        } else {
            // Node.js implementation (using dynamic imports)
            try {
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
                // In browser, serialize to string
                const serializer = new rdfExt.SerializerJsonld()
                const quadStream = dataset.toStream()
                const jsonStream = serializer.import(quadStream)

                // Collect JSON data
                let jsonData = ''
                jsonStream.on('data', chunk => {
                    jsonData += chunk
                })

                return new Promise((resolve, reject) => {
                    jsonStream.on('end', () => {
                        // Trigger download
                        const blob = new Blob([jsonData], { type: 'application/ld+json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = filename.split('/').pop() || 'dataset.jsonld'
                        document.body.appendChild(a)
                        a.click()

                        // Clean up
                        setTimeout(() => {
                            document.body.removeChild(a)
                            URL.revokeObjectURL(url)
                        }, 0)

                        resolve()
                    })

                    jsonStream.on('error', reject)
                })
            } catch (error) {
                logger.error(`Error saving dataset in browser: ${error.message}`)
                throw error
            }
        } else {
            // Node.js implementation
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
                filePath = relativePath // In browser, just use the path as-is for fetch
            } else {
                // Node.js path resolution
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