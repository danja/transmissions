// import logger from './Logger.js'

class SysUtils {

    /* Workaround for structuredClone limitation (bits get lost) */
    static copyMessage(message) {
        const dataset = message.app.dataset
        message = structuredClone(message)
        message.app.dataset = dataset
        return message
    }

    static sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms)
        })
    }
}
export default SysUtils