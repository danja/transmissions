import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'
import SourceService from '../base/SourceService.js'
import logger from '../../utils/Logger.js'

/**
 * Reads a Turtle file and adds it to the message as a dataset.
 * 
 * #### __*Input*__
 * **data** : TODO move ... root dir containing manifest.ttl
 * **message** : any
 * #### __*Output*__
 * **message** : rootDir, dataset (RDF) 
 * @extends SourceService
 */
class ContextReader extends SourceService {

    /**
     * Create a ContextReader.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    getInputKeys() { // TODO this should all be declarative
        return ['sdfsdf']
    }

    getOutputKeys() {
        return ['sdfsdfsdfdataset']
    }


    /**
     * Execute the ContextReader service.
     * @param {Object} message - The message object.
     */
    async execute(message) { // TODO change to one argument 
        this.preProcess(message)
        const manifestFilename = message.rootDir + '/manifest.ttl'
        const stream = fromFile(manifestFilename)

        // should append RDF to incoming
        //   message.rootDir = rootDir
        message.dataset = await rdf.dataset().import(stream)
        //  logger.log('DATASET = \n' + message.dataset)
        this.emit('message', message)
    }
}
export default ContextReader 