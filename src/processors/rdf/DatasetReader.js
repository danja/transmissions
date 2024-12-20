// src/processors/rdf/DatasetReader.js
/**
 * @class DatasetReader
 * @extends Processor
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
import Processor from '../base/Processor.js'
import logger from '../../utils/Logger.js'

class DatasetReader extends Processor {
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
    async process(message) {
        this.preProcess(message) ////// TODO manifest loading has been moved to ApplicationManager

        /// TODO make this more useful!!!
        var datasetName = 'dataset'
        var datasetFilename = path.join(message.rootDir, '/manifest.ttl') // TODO move to system config
        if (message.datasetFilename) {
            datasetFilename = message.datasetFilename
        }
        if (message.datasetName) {
            datasetName = message.datasetName
        }
        /////

        const stream = fromFile(datasetFilename)

        message[datasetName] = await rdf.dataset().import(stream)
        logger.debug(`DatasetReader, datasetName = ${datasetName}`)
        //   logger.debug(`DatasetReader, message[datasetName] = ${message[datasetName]}`)
        return this.emit('message', message)
    }
}

export default DatasetReader