// src/processors/util/CaptureAll.js
/// `USE flow/Accumulate.js instead`
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

/**
 * @class CaptureAll
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Deprecated: Use `flow/Accumulate.js` instead.
 *
 * Captures all incoming messages into a shared `whiteboard` array. Designed as a singleton to accumulate messages for later processing or inspection.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`whiteboard`** - (array) Shared array to accumulate messages; initialized if not present
 *
 * #### __*Input*__
 * * **`message`** - Any message object to be captured
 *
 * #### __*Output*__
 * * **`message`** - Unmodified (but processing is interrupted by an error)
 *
 * #### __*Behavior*__
 * * Captures every message into the `whiteboard` array
 * * Throws an error to indicate deprecation and halt processing
 * * Enforces singleton pattern for the processor instance
 *
 * #### __*Side Effects*__
 * * Mutates the `whiteboard` array in config
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Remove this processor in favor of `flow/Accumulate.js`
 */

class CaptureAll extends Processor {
    constructor(config) {
        // Ensure whiteboard is initialized as an array
        if (!config.whiteboard || !Array.isArray(config.whiteboard)) {
            config.whiteboard = []
        }
        super(config)

        if (CaptureAll.singleInstance) {
            return CaptureAll.singleInstance
        }
        CaptureAll.singleInstance = this
    }

    async process(message) {
        logger.debug(`CaptureAll at [${message.tags}] ${this.getTag()}, done=${message.done}`)
        throw Error(`USE flow/Accumulate.js instead`)
        this.config.whiteboard.push(message)
        return this.emit('message', message)
    }
}

export default CaptureAll