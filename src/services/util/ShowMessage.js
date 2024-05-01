import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'

class ShowMessage extends SinkService {

    async execute(data, context) {


        //    logger.log("\n\nStringSink outputs : \"" + data + "\"\n\n")

        logger.log("\n***  Show Message ***")

        logger.log("***  Data")

        if (Buffer.isBuffer(data)) {
            logger.log('"' + data.toString() + '"')
        }
        else if (typeof data === 'string') {
            logger.log('"' + data + '"')

        } else {
            logger.reveal(data)
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
