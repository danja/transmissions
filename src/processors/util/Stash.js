// src/processors/util/Stash.js
import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'
import Processor from '../../model/Processor.js'

/**
 * @class Stash
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Stashes data from the input into the message object according to configuration in `processors.ttl` (RDF).
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * Configuration in `processors.ttl` determines which key/value pairs are stashed
 *
 * #### __*Input*__
 * * **`data`** - Any data to be stashed
 * * **`message`** - The message object to receive stashed data
 *
 * #### __*Output*__
 * * **`data`** - Unchanged
 * * **`message`** - The message object with additional key/value pairs as determined by configuration
 *
 * #### __*Behavior*__
 * * Reads stash instructions from configuration (RDF)
 * * Adds or updates fields on the message object
 * * Emits the updated message
 *
 * #### __*Side Effects*__
 * * Mutates the message object in place
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Add support for advanced stash patterns
 * * Add tests for various RDF configurations
 */
class Stash extends Processor {

    /**
     * Create a DatasetReader.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Execute the DatasetReader processor.
     * @param {string} data -.
     * @param {Object} message - .
     */
    async process(message) {
        const appFilename = rootDir + '/tt.ttl'
        const stream = fromFile(appFilename)

        // should append RDF to incoming
        message.rootDir = rootDir
        message.dataset = await rdf.dataset().import(stream)
        return this.emit('message', message)
    }
}
export default Stash