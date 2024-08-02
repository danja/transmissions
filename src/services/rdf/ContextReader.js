// src/services/rdf/ContextReader.js
/**
 * @class ContextReader
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

class ContextReader extends SourceService {
    constructor(config) {
        super(config)
    }

    /**
     * @returns {string[]} Array of input keys
     * @todo Implement properly
     */
    getInputKeys() {
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
     * Executes the ContextReader service
     * @param {Object} message - The message object
     */
    async execute(message) {
        this.preProcess(message)
        const manifestFilename = message.rootDir + '/manifest.ttl'
        const stream = fromFile(manifestFilename)

        message.dataset = await rdf.dataset().import(stream)
        this.emit('message', message)
    }
}

export default ContextReader