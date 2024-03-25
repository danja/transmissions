import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'

class ShowDataService extends SinkService {

    execute(data, config) {

        logger.log(data.toString())
        //    logger.log("\n\nStringSink outputs : \"" + data + "\"\n\n")

        logger.log("\n***  ShowDataService ***")
        logger.log("filename : " + data.filename)
        logger.log("content : \n[[[\n" + data.content + "\n]]]")
        /*
         try {
             logger.reveal(data)
 
             return
         } catch {
             // skip
         }
 */
    }
}

export default ShowDataService
