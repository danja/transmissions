import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class NOP extends Service {

    async execute(data, context) {

        logger.log('NOP at (' + context.tags + ') ' + this.getTag())

        this.emit('message', data, context)
    }

    // testing
    double(string) {
        return string + string
    }
}

export default NOP
