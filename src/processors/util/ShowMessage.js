import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class ShowMessage extends Processor {

    constructor(config) {
        super(config)
        this.verbose = false
    }

    async process(message) {

        //    logger.log("\n\nStringSink outputs : \"" + data + "\"\n\n")

        if (this.verbose) logger.log("\n***  Show Message ***")

        logger.log("***************************")
        logger.log("***  Message")
        logger.reveal(message)
        logger.log("***************************")
        //     logger.log("***  Trace")
        //   console.trace() // move to Logger, only when debugging
        // logger.log("***************************")

        return this.emit('message', message)
    }
}

export default ShowMessage
