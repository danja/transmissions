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
 * Can extract values from message fields or use static strings as segments.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.targetField`** - (string, default: 'concat') The target field in the message to store the result
 * * **`ns.trn.values`** - (RDF list) List of segments to combine
 * * **`ns.trn.asPath`** - (boolean) If true, segments are joined as a filesystem path; otherwise concatenated as strings
 *
 * #### __*Input*__
 * * **`message`** - The message object containing fields that may be referenced by segments
 * * **`message.*`** - Any fields referenced in segment definitions
 *
 * #### __*Output*__
 * * **`message[targetField]`** - The combined string or path
 * * **`message`** - The original message with the result added to the target field
 *
 * #### __*Behavior*__
 * * Processes segments in the order they appear in the values list
 * * Each segment can be either:
 *   - A static string (using `:string` predicate)
 *   - A reference to a message field (using `:field` predicate)
 * * Handles path normalization when `asPath` is true
 * * Automatically converts non-string field values to strings
 * * Skips invalid or missing segments with appropriate warnings
 *
 * #### __*Side Effects*__
 * * Modifies the input message by adding/updating the target field
 * * Logs debug information about the combination process
 *
 * #### __*Example Configuration*__
 * ```turtle
 * :pathOps a :Processor ;
 *   :asPath true ;
 *   :targetField "outputPath" ;
 *   :values ( :segment1 :segment2 :segment3 ) .
 *
 * :segment1 :string "/base/path" .
 * :segment2 :field "relative.path" .  # Extracts from message.relative.path
 * :segment3 :string "file.txt" .
 * ```
 *
 * #### __*Tests*__
 * * `./trans -v stringops -m '{"fields": {"fieldB": "TEST", "fieldC": "_PASSED"}}'`
 * * `npm test -- tests/unit/PathOps.spec.js`
 *
 * @example
 * // Basic string concatenation
 * const processor = new PathOps({
 *   [ns.trn.targetField]: 'fullPath',
 *   [ns.trn.values]: [
 *     { [ns.trn.string]: 'base' },
 *     { [ns.trn.field]: 'subpath' },
 *     { [ns.trn.string]: 'file.txt' }
 *   ]
 * });
 * await processor.process({ subpath: 'sub/dir' });
 * // Result: { subpath: 'sub/dir', fullPath: 'basesub/dirfile.txt' }
 *
 * @example
 * // Path joining with asPath
 * const pathProcessor = new PathOps({
 *   [ns.trn.targetField]: 'outputFile',
 *   [ns.trn.asPath]: true,
 *   [ns.trn.values]: [
 *     { [ns.trn.string]: '/base/dir' },
 *     { [ns.trn.field]: 'relative.path' },
 *     { [ns.trn.string]: 'file.txt' }
 *   ]
 * });
 * await pathProcessor.process({ 'relative.path': 'sub/dir' });
 * // Result: { 'relative.path': 'sub/dir', outputFile: '/base/dir/sub/dir/file.txt' }
 */
class PathOps extends Processor {

    /**
     * Creates a new PathOps processor instance.
     * @param {Object} config - Processor configuration
     * @param {string} [config.targetField='concat'] - Field to store the result
     * @param {Array} [config.values=[]] - List of segments to combine
     * @param {boolean} [config.asPath=false] - Whether to join as a filesystem path
     */
    constructor(config) {
        super(config)
    }

    /**
     * Processes the message by combining segments as specified in the configuration.
     * @param {Object} message - The message object to process
     * @returns {Promise<Object|undefined>} The processed message, or undefined if processing should stop
     * @throws {Error} If required configuration is missing
     */
    async process(message) {
        logger.debug(`[PathOps.process]`)

        try {
            if (message.done) {
                logger.debug(`PathOps: Message marked as done, skipping`)
                return this.emit('message', message)
            }

            const targetField = super.getProperty(ns.trn.targetField, 'concat')
            logger.debug(`     targetField = ${targetField}`)

            logger.debug(`     Getting segments from dataset...`)
            const segments = GrapoiHelpers.listToArray(this.app.loadedDataset, this.settingsNode, ns.trn.values)
            if (!segments || !segments.length) {
                logger.error("    no segments found in configuration")
                return this.emit('message', message)
            }
            logger.debug(`     Found ${segments.length} segments`)

            // Check if segments should be joined as a path
            const asPath = super.getProperty(ns.trn.asPath) === 'true'
            logger.debug(`     asPath = ${asPath}`)

            // Combine segments and set in message
            logger.debug(`     Combining segments...`)
            var combined = this.combineSegments(this.app.loadedDataset, message, segments, asPath)
            logger.debug(`     combined = ${combined}`)

            logger.debug(`     Setting ${targetField} to "${combined}"`)
            JSONUtils.set(message, targetField, combined)

            logger.debug(`     PathOps processing complete, emitting message`)
            return this.emit('message', message)
        } catch (error) {
            logger.error(`PathOps.process error: ${error.message}`)
            logger.error(error.stack)
            // Continue with original message on error
            return this.emit('message', message)
        }
    }


    /**
     * Combines segments from the dataset as a string or path.
     * @param {Object} dataset - The RDF dataset containing segment definitions
     * @param {Object} message - The message object containing field values
     * @param {Array} segments - The list of segment terms to process
     * @param {boolean} asPath - Whether to join segments as a filesystem path
     * @returns {string} The combined result
     * @private
     */
    combineSegments(dataset, message, segments, asPath) {
        logger.debug(`    combineSegments, asPath = ${asPath}`)

        try {
            if (!dataset) {
                logger.error("combineSegments: No dataset provided")
                return ''
            }

            if (!segments) {
                logger.error("combineSegments: No segments provided")
                return ''
            }

            var combined = ''
            var segment

            logger.debug(`    Processing ${segments.length} segments`)

            for (var i = 0; i < segments.length; i++) {
                segment = segments[i]
                logger.debug(`    Processing segment ${i}: ${segment?.value}`)

                if (!segment) {
                    logger.warn(`Segment at index ${i} is undefined, skipping`)
                    continue
                }

                // Try to extract a static string value
                let stringSegment = rdf.grapoi({ dataset: dataset, term: segment })
                let stringProperty = stringSegment.out(ns.trn.string)
                logger.debug(`    String property: ${stringProperty?.value}`)

                if (stringProperty && stringProperty.value) {
                    logger.debug(`    Using string value: "${stringProperty.value}"`)
                    if (asPath) {
                        combined = path.join(combined, stringProperty.value)
                        logger.debug(`    Path combined: "${combined}"`)
                        continue
                    }
                    combined = combined + stringProperty.value
                    logger.debug(`    String combined: "${combined}"`)
                    continue
                }

                // Try to extract a field value from the message
                let fieldSegment = rdf.grapoi({ dataset: dataset, term: segment })
                let fieldProperty = fieldSegment.out(ns.trn.field)
                logger.debug(`    Field property: ${fieldProperty?.value}`)

                if (!fieldProperty || !fieldProperty.value) {
                    logger.warn(`Segment ${segment.value} has neither string nor field property`)
                    continue
                }

                logger.debug(`    fieldProperty = ${fieldProperty.value}`)
                let fieldValue = JSONUtils.get(message, fieldProperty.value)
                logger.debug(`    fieldValue = ${fieldValue}`)

                if (fieldValue === undefined || fieldValue === null) {
                    logger.warn(`Warn: missing field value for '${fieldProperty.value}' in message`)
                    continue
                }

                if (asPath) {
                    try {
                        combined = path.join(combined, fieldValue)
                        logger.debug(`    Path joined: "${combined}"`)
                    } catch (e) {
                        logger.error(`Path join error with field '${fieldProperty.value}'`)
                        logger.error(`fieldValue = ${fieldValue}`)
                        logger.error(`combined = ${combined}`)
                        logger.error(`Error: ${e.message}`)
                        continue
                    }
                    continue
                }

                if (typeof fieldValue !== 'string') {
                    fieldValue = JSON.stringify(fieldValue)
                }

                combined = combined + fieldValue
                logger.debug(`    String concatenated: "${combined}"`)
                continue
            }

            logger.debug(`    Final combined result: "${combined}"`)
            return combined
        } catch (error) {
            logger.error(`combineSegments error: ${error.message}`)
            logger.error(error.stack)
            return ''
        }
    }
}
export default PathOps
