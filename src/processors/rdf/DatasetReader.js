import path from 'path'
import rdf from 'rdf-ext'
import { fromFile } from 'rdf-utils-fs'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

class DatasetReader extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        try {
            const datasetFile = super.getProperty(ns.trn.datasetFile)
            const datasetPath = path.join(message.rootDir, datasetFile)

            logger.debug(`Reading dataset from ${datasetPath}`)
            const stream = fromFile(datasetPath)
            message.dataset = await rdf.dataset().import(stream)

            if (message.dataset.size === 0) {
                logger.warn('Empty dataset loaded')
            } else {
                logger.debug(`Loaded dataset with ${message.dataset.size} quads`)
            }

            return this.emit('message', message)
        } catch (err) {
            logger.error('Failed to read dataset:', err)
            throw err
        }
    }
}

export default DatasetReader