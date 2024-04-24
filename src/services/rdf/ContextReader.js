import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'
import SourceService from '../base/SourceService.js'

/**
 * Reads a Turtle file and adds it to the context as a dataset.
 * 
 * #### __*Input*__
 * **data** : root dir containing manifest.ttl
 * **context** : any
 * #### __*Output*__
 * **data** : as Input
 * **context** : adds rootDir, dataset (RDF) 
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

    /**
     * Execute the ContextReader service.
     * @param {string} rootDir - The root directory.
     * @param {Object} context - The context object.
     */
    async execute(rootDir, context) {
        const manifestFilename = rootDir + '/manifest.ttl'
        const stream = fromFile(manifestFilename)

        // should append RDF to incoming
        context.rootDir = rootDir
        context.dataset = await rdf.dataset().import(stream)
        this.emit('message', false, context)
    }
}
export default ContextReader