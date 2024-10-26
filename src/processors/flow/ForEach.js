import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'

class ForEach extends ProcessProcessor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.setLogLevel('debug')
        logger.debug('ForEach execute method called')

        if (!message.foreach || !Array.isArray(message.foreach)) {
            logger.error('ForEach: Invalid or missing foreach array in message')
            message.foreach = ["testing-testing", "one", "two", "three"]
            // throw new Error('Invalid or missing foreach array in message')
        }

        for (const item of message.foreach) {
            const clonedMessage = structuredClone(message)
            clonedMessage.currentItem = item
            delete clonedMessage.foreach // Remove the original array to prevent infinite loops TODO needed?

            logger.debug(`ForEach: Emitting message for item: ${item}`)
            this.emit('message', clonedMessage)
        }

        logger.debug('ForEach: Finished processing all items')
    }
}
export default ForEach