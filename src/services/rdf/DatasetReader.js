// src/services/rdf/DatasetReader.js
/**
 * @class DatasetReader
 * @extends SourceService
 * @classdesc
 * **a Transmissions Service**
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

import rdf from 'rdf-ext'
import { fromFile } from 'rdf-utils-fs'
import SourceService from '../base/SourceService.js'
import logger from '../../utils/Logger.js'

class DatasetReader extends SourceService {
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
     * Executes the DatasetReader service
     * @param {Object} message - The message object
     */
    async execute(message) {
        this.preProcess(message)
        var datasetName = 'manifest' // TODO generalise better
        var datasetFilename = message.rootDir + '/manifest.ttl'
        if (message.datasetFilename) {
            datasetFilename = message.datasetFilename
        }
        if (message.datasetName) {
            datasetName = message.datasetName
        }

        const stream = fromFile(datasetFilename)

        message[datasetName] = await rdf.dataset().import(stream)
        this.emit('message', message)
    }
}

export default DatasetReader