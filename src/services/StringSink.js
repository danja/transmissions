import logger from '../utils/Logger.js'
import Sink from '../mill/SinkService.js';

class StringSink extends Sink {

    write(sinkID, data) {
        logger.log("StringSink.write : " + sinkID + " : " + data)
    }
}

export default StringSink 
