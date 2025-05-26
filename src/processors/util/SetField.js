// src/processors/util/SetField.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'

/**
 * @class SetField
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Sets a specified field on the message to a given value.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.field`** - The name of the field to set on the message
 * * **`ns.trn.value`** - The value to set the field to
 *
 * #### __*Input*__
 * * **`message`** - The message object to be processed
 *
 * #### __*Output*__
 * * **`message`** - The message object with the specified field set to the given value
 *
 * #### __*Behavior*__
 * * Sets the specified field on the message to the provided value
 * * Logs the field update for debugging purposes
 *
 * #### __*Side Effects*__
 * * Modifies the input message object by adding or updating the specified field
 * * Logs debug information about the field update
 *
 * @example
 * // Configuration
 * const config = {
 *   [ns.trn.field]: 'status',
 *   [ns.trn.value]: 'processed'
 * }
 *
 * // Input message
 * const message = { id: 123, data: 'test' }
 *
 * // After processing
 * // message will be: { id: 123, data: 'test', status: 'processed' }
 */
class SetField extends Processor {
    /**
     * Creates a new SetField processor instance.
     * @param {Object} config - Processor configuration object
     */
    constructor(config) {
        super(config)
    }

    /**
     * Processes the message by applying property transformations.
     * @param {Object} message - The message to process
     * @returns {Promise<boolean>} Resolves when processing is complete
     */
    async process(message) {
        logger.debug(`\n\nExample.process`)

        const field = this.getProperty(ns.trn.field)
        const value = this.getProperty(ns.trn.value)

        message[field] = value
        logger.debug(`    set ${field} to ${value}`)

        return this.emit('message', message)
    }
}
export default SetField