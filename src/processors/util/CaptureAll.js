/// `USE flow/Accumulate.js instead`
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

class CaptureAll extends Processor {
    constructor(config) {
        // Ensure whiteboard is initialized as an array
        if (!config.whiteboard || !Array.isArray(config.whiteboard)) {
            config.whiteboard = []
        }
        super(config)

        if (CaptureAll.singleInstance) {
            return CaptureAll.singleInstance
        }
        CaptureAll.singleInstance = this
    }

    async process(message) {
        logger.debug(`CaptureAll at [${message.tags}] ${this.getTag()}, done=${message.done}`)
        throw Error(`USE flow/Accumulate.js instead`)
        this.config.whiteboard.push(message)
        return this.emit('message', message)
    }
}

export default CaptureAll