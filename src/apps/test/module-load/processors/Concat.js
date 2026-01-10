import Processor from '../../../../processors/base/Processor.js'
import logger from '../../../../utils/Logger.js'

class Concat extends Processor {
    constructor(config) {
        super(config)
        logger.log(`Concat process.cwd() = ${process.cwd()}`)
        this.firstKey = 'first'
        this.secondKey = 'second'
        this.resultKey = 'result'
    }

    async process(message) {
        logger.debug('Concat execute method called')
        //  logger.reveal(message)
        // logger.debug(`Input message: ${JSON.stringify(message, null, 2)}`)

        const first = message[this.firstKey]
        const second = message[this.secondKey]

        if (!first || !second) {
            throw new Error(`Missing required inputs : message.${this.firstKey} and message.${this.secondKey}`)
        }

        // Store result in payload
        // if (!message.payload) message.payload = {}
        message.result = first + second

        // logger.debug(`Updated message: ${JSON.stringify(message, null, 2)}`)
        return this.emit('message', message)
    }
}

export default Concat
