import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class ShowTransmission extends Processor {

    async execute(message) {
        logger.log(this.transmission.toString())
        this.emit('message', message)
    }
}

export default ShowTransmission
