import rdf from 'rdf-ext'
import { fromFile } from 'rdf-utils-fs'
import { fileURLToPath } from 'url'
import path from 'path'
import logger from './Logger.js'

class RDFUtils {
    static async loadDataset(relativePath) {
        try {
            const __filename = fileURLToPath(import.meta.url)
            const __dirname = path.dirname(__filename)
            const rootDir = path.resolve(__dirname, '../..')
            const filePath = path.join(rootDir, relativePath)

            logger.debug(`Loading RDF dataset from: ${filePath}`)
            const stream = fromFile(filePath)
            const dataset = await rdf.dataset().import(stream)
            logger.debug(`Loaded ${dataset.size} quads`)

            return dataset
        } catch (error) {
            logger.error(`Error loading dataset: ${error.message}`)
            logger.error(`Stack: ${error.stack}`)
            throw error
        }
    }
}

export default RDFUtils