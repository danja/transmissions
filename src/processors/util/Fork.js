import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'


// rough, only for system testing

class Fork extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {
        const nForks = message.nForks || 2

        logger.debug('forks = ' + nForks)

        for (let i = 0; i < nForks; i++) {
            var messageClone = structuredClone(message)
            messageClone.forkN = i
            logger.debug('--- emit --- ' + i)
            return this.emit('message', messageClone)
        }

        message.done = true // one extra to flag completion

        return this.emit('message', message)
        return this.getOutputs()
    }

}

export default Fork
