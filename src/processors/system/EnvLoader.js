import 'dotenv/config'

// import { readFile } from 'node:fs/promises' // whatever else

import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js' // maybe more specific


/**
 * FileReader class that extends xxxxxProcessor.
 * DESCRIPTION
 * #### __*Input*__
 * **message.INPUT**
 * #### __*Output*__
 * **message.OUTPUT**
 *
 * ### References
 * * https://dotenvx.com/
 * * https://github.com/motdotla/dotenv
*/
class EnvLoader extends Processor {

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
        // console.log(process.env)

        this.config.whiteboard.env = process.env

        return this.emit("message", message)
    }
}

export default EnvLoader