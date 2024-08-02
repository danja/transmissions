import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'
import SourceService from '../base/SourceService.js'

/**
 * Takes the input and stashes it in the message as told by services.ttl
 * 
 * #### __*Input*__
 * **data** : any
 * **message** : any
 * #### __*Output*__
 * **data** : as Input
 * **message** : adds key:value determined by services.ttl
 * @extends SourceService
 */
class Stash extends SourceService {

    /**
     * Create a DatasetReader.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Execute the DatasetReader service.
     * @param {string} data -.
     * @param {Object} message - .
     */
    async execute(message) {
        const manifestFilename = rootDir + '/manifest.ttl'
        const stream = fromFile(manifestFilename)

        // should append RDF to incoming
        message.rootDir = rootDir
        message.dataset = await rdf.dataset().import(stream)
        this.emit('message', message)
    }
}
export default Stash