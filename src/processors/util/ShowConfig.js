import logger from '../../utils/Logger.js'
import SinkProcessor from '../base/SinkProcessor.js'

class ShowConfig extends SinkProcessor {

    constructor(config) {
        super(config)
        this.verbose = false
    }

    async execute(message) {

        //    logger.log("\n\nStringSink outputs : \"" + data + "\"\n\n")

        if (this.verbose) logger.log("\n***  Show Config ***")


        logger.log("***************************")
        logger.log("***  Config")
        logger.reveal(this.config) // TODO the rest
        logger.log("***************************")
        //     logger.log("***  Trace")
        //   console.trace() // move to Logger, only when debugging
        // logger.log("***************************")

        this.emit('message', message)
    }
}

export default ShowConfig
