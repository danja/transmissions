import { readFile } from 'node:fs/promises' // whatever else

import logger from '../../utils/Logger.js' // path will likely change
import Processor from '../base/Processor.js' // maybe more specific

/**
 * FileReader class that extends xxxxxProcessor.
 * DESCRIPTION
 * #### __*Input*__
 * **message.INPUT** 
 * #### __*Output*__
 * **message.OUTPUT**
 */
class ProcessorExample extends Processor {

    /**
     * Constructs a new ProcessorExample instance.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Does something with the message and emits a 'message' event with the processed message.
     * @param {Object} message - The message object.
     */
    async process(message) {
        logger.setLogLevel('debug')

        // processing goes here
        this.emit('message', message)
    } catch(err) {
        logger.error("ProcessorExample.execute error : " + err.message)
    }
}

export default ProcessorExample