import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class DeadEnd extends Service {

    async execute(message) {

        logger.log('DeadEnd  at (' + message.tags + ') ' + this.getTag())

        //    this.emit('message', message)
    }

}

export default DeadEnd 
