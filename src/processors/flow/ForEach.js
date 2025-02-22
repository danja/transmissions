import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../base/Processor.js'

class ForEach extends Processor {
    constructor(config) {
        super(config)
        this.eachCounter = 0
    }

    async process(message) {
        logger.debug('ForEach execute method called')

        const forEach = super.getProperty(ns.trn.forEach)
        const split = forEach.split('.')

        // TODO is similar in 'processors/json/JsonRestructurer.js' - move to utils?
        const reduced = split.reduce((acc, part) => acc[part], message)

        logger.debug(`ForEach, reduced.length = ${reduced.length}`)

        //  logger.reveal(reduced)

        message.done = false
        for (const item of reduced) {
            const clonedMessage = structuredClone(message)
            clonedMessage.currentItem = item
            //    delete clonedMessage.foreach // Remove the original array to prevent infinite loops TODO needed?

            logger.debug(`ForEach: Emitting message for item: ${item}`)
            clonedMessage.eachCounter = this.eachCounter++
            this.emit('message', clonedMessage)
        }
        //   message.done = true
        // this.emit('message', message)
        logger.debug('ForEach: Finished processing all items')
    }
}
export default ForEach