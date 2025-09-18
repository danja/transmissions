// src/processors/flow/GOTO.js


import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'


class GOTO extends Processor {
    /**
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
        const targetTransmissionId = super.getProperty(ns.trn.gotoTarget)

        if (!targetTransmissionId) {
            logger.debug(`GOTO: No target transmission specified, continuing with current message`)
            return this.emit('message', message)
        }

        // Find the target transmission
        const targetTransmission = this.findTransmission(targetTransmissionId)
        if (!targetTransmission) {
            logger.warn(`GOTO: Target transmission '${targetTransmissionId}' not found, continuing with current message`)
            return this.emit('message', message)
        }

        logger.debug(`GOTO: Executing target transmission '${targetTransmissionId}'`)

        try {
            // Execute the target transmission with the current message
            const result = await targetTransmission.process(message)
            return this.emit('message', result)
        } catch (error) {
            logger.error(`GOTO: Error executing target transmission '${targetTransmissionId}': ${error.message}`)
            // Continue with original message on error
            return this.emit('message', message)
        }
    }
}
export default GOTO