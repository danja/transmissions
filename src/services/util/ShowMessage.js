import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'

class ShowMessage extends SinkService {

    async execute(data, context) {


        //    logger.log("\n\nStringSink outputs : \"" + data + "\"\n\n")

        logger.log("\n***  Message ***")

        logger.log("***  Data")
        if (typeof data === 'string') {
            logger.log('"' + data + '"')
        }
        else if (Buffer.isBuffer(data)) {
            logger.log('"' + data.toString() + '"')
        } else {
            logger.reveal(data)
        }
        logger.log("***************************")
        logger.log("***  Context")
        logger.reveal(context)
        logger.log("***************************")
        logger.log("***  Trace")
        console.trace()
        logger.log("***************************")

        //  logger.log(data.toString())

        //       logger.log("filename : " + context.filename)

        this.emit('message', data, context)
    }
}

export default ShowMessage
