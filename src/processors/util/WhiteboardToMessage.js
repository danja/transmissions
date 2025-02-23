import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

class WhiteboardToMessage extends Processor {

    constructor(config) {
        super(config)
    }
    async process(message) {

        logger.debug('WhiteboardToMessage at [' + message.tags + '] ' + this.getTag())

        const originalArray = this.config.whiteboard

        message.whiteboard = Object.keys(originalArray).reduce((acc, key) => {
            const value = originalArray[key]
            if (value !== undefined && value !== null) {
                Object.keys(value).forEach((prop) => {
                    if (!acc[prop]) {
                        acc[prop] = []
                    }
                    acc[prop].push(value[prop])
                })
            }
            return acc
        }, {})

        return this.emit('message', message)
    }
}

export default WhiteboardToMessage
