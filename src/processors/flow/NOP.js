import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'

class NOP extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {
        const done = message.done ? `DONE` : `NOT DONE`
        logger.log(`\nNOP at [${message.tags}] ${this.getTag()} (${done})`)

        return this.emit('message', message)
    }

    double(string) {
        return string + string
    }
}
export default NOP
