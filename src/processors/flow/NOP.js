import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'

class NOP extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {
        const done = message.done ? `done = true` : `done = false`

        logger.debug(`\nNOP at [${message.tags}] ${this.getTag()} (${done})`)
        const test = await super.getProperty(ns.trn.test, "TEST_FAILED")
        if (test) {
            //      logger.log(test)
        }
        // logger.log(this)

        return this.emit('message', message)
    }

    double(string) {
        return string + string
    }
}
export default NOP
