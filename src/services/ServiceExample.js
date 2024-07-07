import { readFile } from 'node:fs/promises' // whatever else

import logger from '../utils/Logger.js' // path will likely change
import Service from '../base/Service.js' // maybe more specific

/**
 * FileReader class that extends xxxxxService.
 * DESCRIPTION
 * #### __*Input*__
 * **context.INPUT** 
 * #### __*Output*__
 * **context.OUTPUT**
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
     * Does something with the context and emits a 'message' event with the processed context.
     * @param {Object} context - The context object.
     */
    async execute(context) {
        // processing goes here
        this.emit('message', context)
    } catch(err) {
        logger.error("ServiceExample.execute error : " + err.message)
    }
}

export default ServiceExample