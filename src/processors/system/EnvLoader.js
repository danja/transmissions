import { config } from '@dotenvx/dotenvx'

// import { readFile } from 'node:fs/promises' // whatever else

import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js' // maybe more specific


// src/processors/system/EnvLoader.js
/**
 * @class EnvLoader
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Loads environment variables from `.env` files into `process.env` using the `dotenv` package, making them available to the application and downstream processors.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * None specific; relies on standard `.env` configuration and inheritance from `Processor`.
 *
 * #### __*Input*__
 * * **`message`** - The message object to be processed (any shape, not modified by this processor).
 *
 * #### __*Output*__
 * * **`message`** - Unmodified message, but with `this.config.whiteboard.env` set to the current `process.env`.
 *
 * #### __*Behavior*__
 * * Loads environment variables using `dotenv` (via import).
 * * Attaches the full `process.env` to `this.config.whiteboard.env` for downstream use.
 * * Emits the (unmodified) message event.
 *
 * #### __*Side Effects*__
 * * None (modifies in-memory config only).
 *
 * #### __*ToDo*__
 * Consider supporting custom `.env` file locations via settings.
 * Add validation or logging for loaded environment variables as needed.
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
        
        // Load environment variables from .env files
        config()
        
        // console.log(process.env)
        this.config.whiteboard.env = process.env

        return this.emit("message", message)
    }
}

export default EnvLoader