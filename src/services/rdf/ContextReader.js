import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'
import SourceService from '../base/SourceService.js'
import logger from '../../utils/Logger.js'

/**
 * Reads a Turtle file and adds it to the context as a dataset.
 * 
 * #### __*Input*__
 * **data** : TODO move ... root dir containing manifest.ttl
 * **context** : any
 * #### __*Output*__
 * **context** : rootDir, dataset (RDF) 
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
     * @param {Object} context - The context object.
     */
    async execute(context) { // TODO change to one argument 
        this.preProcess(context)
        const manifestFilename = context.rootDir + '/manifest.ttl'
        const stream = fromFile(manifestFilename)

        // should append RDF to incoming
        //   context.rootDir = rootDir
        context.dataset = await rdf.dataset().import(stream)
        //  logger.log('DATASET = \n' + context.dataset)
        this.emit('message', context)
    }
}
export default ContextReader 