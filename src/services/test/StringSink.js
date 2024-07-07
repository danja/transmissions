import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'

class StringSink extends SinkService {

    execute(context) {
        logger.log("\n\nStringSink outputs : \"" + data + "\"\n\n")
    }
}

export default StringSink 
