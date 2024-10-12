import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'

class ForEach extends ProcessProcessor {
    constructor(config) {
        super(config)
    }

    async execute(message) {
        logger.setLogLevel('debug')
        logger.debug('ForEach execute method called')

        if (!message.foreach || !Array.isArray(message.foreach)) {
            logger.error('ForEach: Invalid or missing foreach array in message')
            throw new Error('Invalid or missing foreach array in message')
        }

        for (const item of message.foreach) {
            const clonedMessage = structuredClone(message)
            clonedMessage.currentItem = item
            delete clonedMessage.foreach // Remove the original array to prevent infinite loops

            logger.debug(`ForEach: Emitting message for item: ${item}`)
            this.emit('message', clonedMessage)
        }

        logger.debug('ForEach: Finished processing all items')
    }
}

export default ForEach