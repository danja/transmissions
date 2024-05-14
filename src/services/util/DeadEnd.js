import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class DeadEnd extends Service {

    async execute(data, context) {

        logger.log('DeadEnd  at (' + context.tags + ') ' + this.getTag())

        //    this.emit('message', data, context)
    }

}

export default DeadEnd 
