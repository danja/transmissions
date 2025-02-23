import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

class ShowTransmission extends Processor {

    async process(message) {
        logger.log(this.transmission.toString())
        return this.emit('message', message)
    }
}

export default ShowTransmission
