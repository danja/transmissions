import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'
import SourceService from '../base/SourceService.js'

/**
 * Takes the input and stashes it in the context as told by services.ttl
 * 
 * #### __*Input*__
 * **data** : any
 * **context** : any
 * #### __*Output*__
 * **data** : as Input
 * **context** : adds key:value determined by services.ttl
 * @extends SourceService
 */
class Stash extends SourceService {

    /**
     * Create a ContextReader.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Execute the ContextReader service.
     * @param {string} data -.
     * @param {Object} context - .
     */
    async execute(context) {
        const manifestFilename = rootDir + '/manifest.ttl'
        const stream = fromFile(manifestFilename)

        // should append RDF to incoming
        context.rootDir = rootDir
        context.dataset = await rdf.dataset().import(stream)
        this.emit('message', context)
    }
}
export default Stash