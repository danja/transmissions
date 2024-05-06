import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'

class ShowMessage extends SinkService {

    constructor(config) {
        super(config)
        this.verbose = false
    }

    async execute(data, context) {

        //    logger.log("\n\nStringSink outputs : \"" + data + "\"\n\n")

        if (this.verbose) logger.log("\n***  Show Message ***")

        if (this.verbose) logger.log("***  Data")

        if (Buffer.isBuffer(data)) {
            if (this.verbose) logger.log('"' + data.toString() + '"')
        }
        else if (typeof data === 'string') {
            if (this.verbose) logger.log('"' + data + '"')

        } else {
            if (this.verbose) logger.reveal(data)
        }
        logger.log("***************************")
        logger.log("***  Context")
        logger.reveal(context)
        logger.log("***************************")
        //     logger.log("***  Trace")
        //   console.trace() // move to Logger, only when debugging
        // logger.log("***************************")

        this.emit('message', data, context)
    }
}

export default ShowMessage
