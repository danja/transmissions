import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class DeadEnd extends Service {

    async execute(context) {

        logger.log('DeadEnd  at (' + context.tags + ') ' + this.getTag())

        //    this.emit('message', context)
    }

}

export default DeadEnd 
