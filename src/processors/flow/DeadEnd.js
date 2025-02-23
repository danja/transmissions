import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

class DeadEnd extends Processor {

    async process(message) {
        logger.log('DeadEnd at [' + message.tags + '] ' + this.getTag())
    }

}
export default DeadEnd
