// src/processors/rdf/DatasetReader.js
/**
 * @class DatasetReader
 * @extends SourceProcessor
 * @classdesc
 * **a Transmissions Processor**
 * 
 * Reads a Turtle file and adds it to the message as an RDF dataset.
 * 
 * #### __*Input*__
 * * **`message.rootDir`** - Root directory containing `manifest.ttl`
 * 
 * #### __*Output*__
 * * **`message.rootDir`** - Unchanged
 * * **`message.dataset`** - RDF dataset created from `manifest.ttl`
 * 
 * #### __*Behavior*__
 * * Reads the manifest.ttl file from the rootDir
 * * Creates an RDF dataset from the Turtle file
 * * Adds the dataset to the message object
 * 
 * #### __Tests__
 * * TODO: Add test information
 */

import path from 'path'
import rdf from 'rdf-ext'
import { fromFile } from 'rdf-utils-fs'
import SourceProcessor from '../base/SourceProcessor.js'
import logger from '../../utils/Logger.js'

class DatasetReader extends SourceProcessor {
    constructor(config) {
        super(config)
    }

    /**
     * @returns {string[]} Array of input keys
     * @todo Implement properly
     */
    getInputKeys() { // what were these for!?
        return ['sdfsdf']
    }

    /**
     * @returns {string[]} Array of output keys
     * @todo Implement properly
     */
    getOutputKeys() {
        return ['sdfsdfsdfdataset']
    }

    /**
     * Executes the DatasetReader processor
     * @param {Object} message - The message object
     */
    async execute(message) {
        this.preProcess(message)
        var datasetName = 'dataset' // TODO rename to manifest, generalise better
        var datasetFilename = path.join(message.rootDir, '/manifest.ttl')
        if (message.datasetFilename) {
            datasetFilename = message.datasetFilename
        }
        if (message.datasetName) {
            datasetName = message.datasetName
        }

        const stream = fromFile(datasetFilename)

        // TODO this needs changing
        message[datasetName] = await rdf.dataset().import(stream)
        logger.log(`-------------------------DatasetReader, datasetName = ${datasetName}`)
        logger.log(`-------------------------DatasetReader, message[datasetName] = ${message[datasetName]}`)
        this.emit('message', message)
    }
}

export default DatasetReader