import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import DeadEnd from './DeadEnd.js'

// src/processors/flow/Unfork.js
/**
 * @class Unfork
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * A flow control processor that filters messages based on their 'done' status.
 * Primarily used to terminate processing pipelines when a 'done' message is received.
 *
 * ### Processor Signature
 *
 * #### __*Input*__
 * * **`message`** - Any message object
 * * **`message.done`** - Boolean flag indicating if processing is complete
 * * **`message.tags`** - Array of tags for debugging purposes
 *
 * #### __*Output*__
 * * **`message`** - Forwarded message with `done` set to `false` (if `message.done` was true)
 * * **`undefined`** - No output if `message.done` is false
 *
 * #### __*Behavior*__
 * * Forwards messages with `done: true` after setting `done: false`
 * * Terminates the pipeline for messages with `done: false`
 * * Logs debug information about message processing
 *
 * #### __*Side Effects*__
 * * Modifies the `done` property of forwarded messages
 * * Logs debug information
 *
 * @example
 * // In a processor chain:
 * const unfork = new Unfork({});
 * 
 * // Forwards the message:
 * await unfork.process({ done: true, tags: ['test'] });
 * 
 * // Terminates the pipeline:
 * await unfork.process({ done: false });
 */
class Unfork extends Processor {

    /**
     * Creates a new Unfork processor instance.
     * @param {Object} config - Processor configuration object
     */
    constructor(config) {
        super(config)

        // Note: Singleton pattern was considered but not implemented
        // if (Unfork._instance) {
        //     return new DeadEnd(config);
        // }
        // Unfork._instance = this;
    }

    /**
     * Processes the message based on its 'done' status.
     * @param {Object} message - The message to process
     * @param {boolean} [message.done] - Indicates if processing is complete
     * @param {Array} [message.tags] - Tags for debugging
     * @returns {Promise<boolean|undefined>} Resolves when processing is complete
     */
    async process(message) {
        //     logger.setLogLevel("debug")
        logger.debug(`Unfork got message with done=${message.done}, tags=${message.tags}`)

        logger.debug('Unfork ----')
        if (message.done) {
            logger.debug(' - Unfork passing message >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            message.done = false // in case it's needed later

            /*
                        await new Promise(resolve => {
                            //    super.emit(event, message)
                            return this.emit('message', message)
                            resolve()
                            logger.log(`after resolve has ${message.done}`)
                        })
            */
            return this.emit('message', message)
        } else {
            logger.debug(' - Unfork terminating pipe')
            return
        }
    }
}
export default Unfork
