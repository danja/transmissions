import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'

class ShowMessage extends SinkService {

    async execute(data, context) {


        //    logger.log("\n\nStringSink outputs : \"" + data + "\"\n\n")

        logger.log("\n***  ShowMessageService ***")
        logger.reveal(data)
        console.trace()

        logger.log(data.toString())

        //       logger.log("filename : " + context.filename)

        this.emit('message', data, context)
    }
}

export default ShowMessage
