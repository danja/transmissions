// src/processors/fs/PathOps.js

import path from 'path'
import logger from '../../utils/Logger.js'
import rdf from 'rdf-ext'
import ns from '../../utils/ns.js'
import GrapoiHelpers from '../../utils/GrapoiHelpers.js'
import JSONUtils from '../../utils/JSONUtils.js'
import Processor from '../../model/Processor.js'

/**
 * @class PathOps
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Performs path operations by combining segments from settings, supporting both path and string concatenation.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.targetField`** - The target field in the message to set the result
 * * **`ns.trn.values`** - List of segments to combine (as RDF list)
 * * **`ns.trn.asPath`** - If true, segments are joined as a path; otherwise, concatenated as strings
 *
 * #### __*Input*__
 * * **`message`** - The message object, expected to contain fields referenced by segments
 *
 * #### __*Output*__
 * * **`message`** - The message object with the combined string/path set at the target field
 *
 * #### __*Behavior*__
 * * Reads segment definitions from RDF dataset, config, or transmissionConfig
 * * Combines segments as a path or string based on settings
 * * Supports extracting values from message fields or static strings
 * * Logs debug information about the process and segments
 *
 * #### __*Side Effects*__
 * * None (message is modified in place)
 *
 * #### __Tests__
 * * **`./trans -v stringops -m '{"fields": {"fieldB" : "TEST","fieldC":"_PASSED"}}'`**
 
 * #### __Example Usage__
 * :asPath true ;
 * :values (:a :b :c :d) .
 * :a :string "/home/danny/sites/strandz.it/postcraft/public" .
 * :b :field "currentItem.relPath.value" .
 * :c :field "currentItem.slug.value" .
 * :d :string ".html" .
 */
class PathOps extends Processor {

    /**
     * Constructs a PathOps processor.
     * @param {Object} config - Processor configuration.
     */
    constructor(config) {
        super(config)
        this.config = undefined
        this.settingsNode = undefined
    }

    /**
     * Processes the message by combining segments as a string or path and sets the result in the target field.
     * @param {Object} message - The message object to process.
     * @returns {Promise<Object|undefined>} The processed message, or undefined if already done.
     */
    async process(message) {
        logger.debug(`PathOps.process`)
        logger.warn('TODO PathOps.process, message not checked')

        const targetField = super.getProperty(ns.trn.targetField, 'concat')
        logger.debug(`     targetField = ${targetField}`)

        if (message.done) return


        const segments = GrapoiHelpers.listToArray(this.app.loadedDataset, this.settingsNode, ns.trn.values)


        // Check if segments should be joined as a path
        const asPath = super.getProperty(ns.trn.asPath) === 'true'

        logger.trace(`this.app = ${this.app}`)

        // Combine segments and set in message
        var combined = this.combineSegments(this.app.loadedDataset, message, segments, asPath)
        logger.debug(`combined = ${combined}`)

        JSONUtils.set(message, targetField, combined)
        return this.emit('message', message)
    }


    /**
     * Combines segments from the dataset as a string or path, extracting values from message or static strings.
     * @param {Object} dataset - The RDF dataset or config object.
     * @param {Object} message - The message object.
     * @param {Array} segments - The list of segment terms to combine.
     * @param {boolean} asPath - Whether to join segments as a path.
     * @returns {string} The combined string or path.
     */
    combineSegments(dataset, message, segments, asPath) {
        logger.debug(`PathOps.combineSegments,
    segments = ${logger.reveal(segments)}
    asPath = ${asPath}`)
        var combined = ''
        var segment
        for (var i = 0; i < segments.length; i++) {
            segment = segments[i]

            // Try to extract a static string value
            let stringSegment = rdf.grapoi({ dataset: dataset, term: segment })
            let stringProperty = stringSegment.out(ns.trn.string)
            if (stringProperty && stringProperty.value) {
                if (asPath) {
                    combined = path.join(combined, stringProperty.value)
                    continue
                }
                combined = combined + stringProperty.value
                continue
            }

            // Try to extract a field value from the message
            let fieldSegment = rdf.grapoi({ dataset: dataset, term: segment })
            let fieldProperty = fieldSegment.out(ns.trn.field)
            logger.debug(`    fieldProperty = ${fieldProperty.value}`)

            if (fieldProperty && fieldProperty.value) {
                let fieldValue = JSONUtils.get(message, fieldProperty.value)
                logger.debug(`    fieldValue = ${fieldValue}`)
                if (!fieldValue) {
                    logger.warn(`No fieldValue for ${fieldProperty.value}`)
                    continue
                }
                if (asPath) {
                    try {
                        combined = path.join(combined, fieldValue)
                    } catch (e) {
                        logger.error(`fieldProperty = ${fieldProperty.value}`)
                        logger.error(`fieldValue = ${fieldValue}`)
                        logger.error(`combined = ${combined}`)
                        throw new Error(e)
                    }
                    continue
                }
                if ('string' != typeof fieldValue) {
                    fieldValue = JSON.stringify(fieldValue)
                }
                combined = combined + fieldValue
                continue
            }
        }
        return combined
    }
}
export default PathOps
