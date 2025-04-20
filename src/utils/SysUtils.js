// import logger from './Logger.js'

import logger from "./Logger"

class SysUtils {

    /* Workaround for structuredClone limitation (bits get lost) */
    static copyMessage(message) {
        const dataset = message.app.dataset
        message = structuredClone(message)
        message.app.dataset = dataset
        return message
    }

    static sleep(ms = 100) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }

    // TODO wire in garbage collection
    static gc() {
        if (global.gc) {
            global.gc()
            logger.debug('<<<Garbage collection triggered>>>')
        } else {
            logger.warn('Garbage collection triggered without global.gc, check ./trans-gc')
        }
    }
export default SysUtils