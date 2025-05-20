import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import SysUtils from '../../utils/SysUtils.js'
import SlowableProcessor from '../../model/SlowableProcessor.js'
import JSONUtils from '../../utils/JSONUtils.js'

// src/processors/flow/ForEach.js
/**
 * @class ForEach
 * @extends SlowableProcessor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Iterates over an array in a message and processes each item individually.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.forEach`** - Dot-notation path to the array in the message (default: 'forEach')
 * * **`ns.trn.remove`** - Optional path to remove from each message (default: false)
 * * **`ns.trn.delay`** - Delay between processing items in milliseconds (default: '100')
 *
 * #### __*Input*__
 * * **`message`** - The message object containing an array to iterate over
 * * **`message[forEach]`** - The array to iterate over (path specified by `ns.trn.forEach`)
 *
 * #### __*Output*__
 * * **`message`** - Original message with `done=true` after all items are processed
 * * **`message`** - Multiple messages (one per array item) with `currentItem` set to the current array item
 *
 * #### __*Behavior*__
 * * Iterates over each item in the specified array
 * * For each item, creates a new message with `currentItem` set to the current array item
 * * Optionally removes specified paths from each message
 * * Maintains an internal counter for each processed item
 * * Emits the original message with `done=true` after all items are processed
 *
 * #### __*Side Effects*__
 * * Modifies the input message by adding/updating properties
 * * Creates new message objects for each array item
 * * Logs debug and trace information during processing
 *
 * #### __*Tests*__
 * * TODO: Add test coverage
 */
class ForEach extends SlowableProcessor {
    /**
     * Creates a new ForEach processor instance.
     * @param {Object} config - Processor configuration object
     */
    constructor(config) {
        super(config)
        /** @private */
        this.eachCounter = 0
    }

    /**
     * Processes the message by iterating over the specified array and processing each item.
     * @param {Object} message - The message containing the array to process
     * @returns {Promise<void>}
     */
    async process(message) {
        logger.debug('\nForEach.process')

        // TODO default?
        const forEach = super.getProperty(ns.trn.forEach, 'forEach')

        logger.debug(`   forEach = ${forEach}`)
        // TODO add support for removeOrigin - see Restructure, RDFUtils

        const remove = super.getProperty(ns.trn.remove, false)
        logger.debug(`    remove = ${remove}`)

        const split = forEach.split('.')

        // TODO is similar in 'processors/json/JsonRestructurer.js' - move to utils?
        const reduced = split.reduce((acc, part) => acc[part], message)

        logger.debug(`    reduced.length = ${reduced.length}`)

      //    logger.v(reduced)

        const delay = super.getProperty(ns.trn.delay, '100')

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
            //  await SysUtils.sleep(delay)
        }
        message.done = true
        /////////////////// TODO put back in
        this.emit('message', message)
        logger.trace('ForEach: Finished processing all items')
    }
}
export default ForEach