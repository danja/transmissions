import logger from '../utils/Logger.js'
import Sink from '../mill/SinkService.js';

class StringSink extends Sink {

    execute(data, config) {
        logger.log("\n\nStringSink says : \"" + data + "\"\n\n")
    }
}

export default StringSink 
