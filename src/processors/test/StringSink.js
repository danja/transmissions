import logger from '../../utils/Logger.js'
import SinkProcessor from '../base/SinkProcessor.js'

class StringSink extends SinkProcessor {

    process(message) {
        logger.log("\n\nStringSink outputs : \"" + data + "\"\n\n")
    }
}

export default StringSink 
