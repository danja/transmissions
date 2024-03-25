import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'

class ShowDataService extends SinkService {

    execute(data, config) {
        try {
            logger.log(data.toString())
            return
        } catch {
            // skip
        }
        //    logger.log("\n\nStringSink outputs : \"" + data + "\"\n\n")
        logger.log("\n***  ShowDataService ***")
        logger.log("filename : " + data.filename)
        logger.log("content : \n[[[\n" + data.content + "\n]]]")
        logger.reveal(data)

    }
}

export default ShowDataService
