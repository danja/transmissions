import { readFile } from 'node:fs/promises' // whatever else

import logger from '../utils/Logger.js' // path will likely change
import Service from '../base/Service.js' // maybe more specific

/**
 * FileReader class that extends xxxxxService.
 * DESCRIPTION
 * #### __*Input*__
 * **message.INPUT** 
 * #### __*Output*__
 * **message.OUTPUT**
 */
class ServiceExample extends Service {

    /**
     * Constructs a new ServiceExample instance.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Does something with the message and emits a 'message' event with the processed message.
     * @param {Object} message - The message object.
     */
    async execute(message) {
        // processing goes here
        this.emit('message', message)
    } catch(err) {
        logger.error("ServiceExample.execute error : " + err.message)
    }
}

export default ServiceExample