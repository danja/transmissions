import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

class ShowConfig extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {

        logger.log("***************************")
        logger.v(this)
        logger.log("***************************")
        return this.emit('message', message)
    }
}

export default ShowConfig
