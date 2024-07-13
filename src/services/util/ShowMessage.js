import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'

class ShowMessage extends SinkService {

    constructor(config) {
        super(config)
        this.verbose = false
    }

    async execute(message) {

        //    logger.log("\n\nStringSink outputs : \"" + data + "\"\n\n")

        if (this.verbose) logger.log("\n***  Show Message ***")


        logger.log("***************************")
        logger.log("***  Context")
        logger.reveal(message)
        logger.log("***************************")
        //     logger.log("***  Trace")
        //   console.trace() // move to Logger, only when debugging
        // logger.log("***************************")

        this.emit('message', message)
    }
}

export default ShowMessage
