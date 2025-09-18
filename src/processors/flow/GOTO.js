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

const targetTransmission = super.getProperty(ns.trn.gotoTarget)

/* 
something is called here, probably in the ProcessorImpl superclass
it will cause the transmission ns.trn.gotoTarget to be run
with message passed in
*/

        return this.emit('message', message)
    }
}
export default GOTO