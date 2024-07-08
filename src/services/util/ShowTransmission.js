import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class ShowTransmission extends Service {

    async execute(message) {
        logger.log(this.transmission.toString())
        this.emit('message', message)
    }
}

export default ShowTransmission
