import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class ShowTransmission extends Service {

    async execute(data, context) {
        logger.log(this.transmission.toString())
        this.emit('message', data, context)
    }
}

export default ShowTransmission
