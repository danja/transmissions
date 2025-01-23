import logger from '../../../utils/Logger.js'
import Processor from '../../base/Processor.js'

class StringSink extends Processor {

    process(message) {
        logger.log("\n\nStringSink outputs : \"" + message + "\"\n\n")
    }
}

export default StringSink
