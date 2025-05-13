// src/processors/util/SetMessage.js
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'

/**
 * @class SetMessage
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Sets fields on the message object using key/value pairs defined in RDF configuration.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.setValue`** - RDF list of setter nodes, each with a key and value
 *
 * #### __*Input*__
 * * **`message`** - The message object to update
 *
 * #### __*Output*__
 * * **`message`** - The message object with new/updated fields set
 *
 * #### __*Behavior*__
 * * Reads key/value pairs from RDF configuration
 * * Sets each key/value on the message object
 * * Emits the updated message
 *
 * #### __*Side Effects*__
 * * None (message is modified in place)
 *
 * #### __Tests__
 * * (Add test command here if available)
 */
class SetMessage extends Processor {

    /**
     * Constructs a SetMessage processor.
     * @param {Object} config - Processor configuration.
     */
    constructor(config) {
        super(config)
        logger.log('SetMessage constructor')
    }

    /**
     * Sets fields on the message object using key/value pairs from RDF config.
     * @param {Object} message - The message object to update.
     * @returns {Promise<Object>} The updated message object.
     */
    async process(message) {
        //   logger.setLogLevel('debug')
        const setters = await this.getSetters(this.config, this.settingsNode, ns.trn.setters)
        for (let i = 0; i < setters.length; i++) {
            message[setters[i].key] = setters[i].value
        }
        return this.emit('message', message)
    }


    /**
     * Extracts key/value setter pairs from RDF configuration.
     * @param {Object} config - The RDF config dataset.
     * @param {Object} settings - The settings node.
     * @param {Object} term - The RDF property for the setter list.
     * @returns {Promise<Array<{key: string, value: string}>>} Array of setter objects.
     */
    async getSetters(config, settings, term) { // TODO refactor - is same in RestructureJSON
        //   logger.debug(`***** config = ${config}`)
        logger.debug(`***** settings.value = ${settings.value}`)
        logger.debug(`***** term = ${term}`)
        const settersRDF = GrapoiHelpers.listToArray(config, settings, term)
        const dataset = this.config
        var setters = []
        for (let i = 0; i < settersRDF.length; i++) {
            let setter = settersRDF[i]
            let poi = rdf.grapoi({ dataset: dataset, term: setter })
            let key = poi.out(ns.trn.key).value
            let value = poi.out(ns.trn.value).value
            setters.push({ "key": key, "value": value })
        }
        return setters
    }
}

export default SetMessage
