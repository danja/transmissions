// src/processors/example-group/Eye.js
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import { n3reasoner } from 'eyereasoner';

/**
 * @class Eye
 * @extends Processor
 * @classdesc
 * **Eye Processor**
 *
 * The Eye processor integrates with the Eye reasoner to perform logical inference on RDF data.
 * It processes input messages by applying reasoning queries and generating inferred data.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`none`**
 *
 * #### __*Input*__
 * * **`message`** - The message object to be processed
 *
 * #### __*Output*__
 * * **`message`** - The modified message object with added/updated fields
 *
 * #### __*Behavior*__
 * * Applies reasoning queries to RDF data
 * * Generates inferred data from the input
 *
 * #### __*Side Effects*__
 *
 * #### __*Notes*__
 * This implementation demonstrates:
 *   - Integration with the Eye reasoner
 *   - Logical inference on RDF data
 *   - Property retrieval with fallbacks
 *   - Message modification
 *   - Logging
 *
 */
class Eye extends Processor {
    /**
     * Creates a new Eye processor instance.
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
        logger.debug(`\n\nEye.process`)

        message.result = await n3reasoner(message.data, message.query);
        message.inferred = await n3reasoner(message.data);

        return this.emit('message', message)
    }
}
export default Eye