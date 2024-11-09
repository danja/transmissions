import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class CaptureAll extends Processor {

    constructor(config) {
        if (!config.whiteboard) {  // TODO refactor
            config.whiteboard = []
        }
        super(config)

        // Singleton
        if (CaptureAll.singleInstance) {
            return CaptureAll.singleInstance
        }
        CaptureAll.singleInstance = this
    }


    async process(message) {
        logger.log('CaptureAll at (' + message.tags + ') ' + this.getTag())
        this.config.whiteboard.push(message)
        return this.emit('message', message)
    }


}

export default CaptureAll
