import logger from '../utils/Logger.js'
import SinkService from '../mill/SinkService.js';

class StringSink extends SinkService {

    execute(data, config) {
        logger.log("\n\nStringSink says : \"" + data + "\"\n\n")
    }
}

export default StringSink 
