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
class HttpClient extends Processor {

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
        //   logger.setLogLevel('debug')

        // processing goes here
        return this.emit('message', message)
    }
}

export default HttpClient