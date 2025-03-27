import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import SysUtils from '../../utils/SysUtils.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'

class ForEach extends Processor {
    constructor(config) {
        super(config)
        this.eachCounter = 0
    }

    async process(message) {
        logger.trace('ForEach execute method called')

        // TODO default?
        const forEach = super.getProperty(ns.trn.forEach)

        // TODO add suport for removeOrigin - see Restructure, RDFUtils

        const remove = super.getProperty(ns.trn.remove, false)
        //  logger.warn(`REMOVE = ${remove}`)
        const split = forEach.split('.')

        // TODO is similar in 'processors/json/JsonRestructurer.js' - move to utils?
        const reduced = split.reduce((acc, part) => acc[part], message)

        logger.trace(`ForEach, reduced.length = ${reduced.length}`)

        //  logger.reveal(reduced)

        message.done = false
        for (const item of reduced) {
            //  const clonedMessage = structuredClone(message)

            var clonedMessage = SysUtils.copyMessage(message)
            if (remove) {
                //      logger.warn(`REMOVE ORIGIN ${remove}`)
                clonedMessage = JSONUtils.remove(clonedMessage, remove)
            }
            clonedMessage.currentItem = item
            //    delete clonedMessage.foreach // Remove the original array to prevent infinite loops TODO needed?

            logger.trace(`ForEach: Emitting message for item: ${item}`)
            clonedMessage.eachCounter = this.eachCounter++
            this.emit('message', clonedMessage)
        }
        message.done = true
        /////////////////// TODO put back in
        this.emit('message', message)
        logger.trace('ForEach: Finished processing all items')
    }
}
export default ForEach