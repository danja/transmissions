import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

class ShowConfig extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {

        logger.log("***************************")
        logger.log("***   Config Triples   ***")
        logger.log(this.config)
        logger.log("***************************")
        return this.emit('message', message)
    }
}

export default ShowConfig
