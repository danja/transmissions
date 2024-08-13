import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class NOP extends Service {

    constructor(config) {
        super(config);
    }
    async execute(message) {

        logger.log('NOP at (' + message.tags + ') ' + this.getTag())

        this.emit('message', message)
    }

    // testing
    double(string) {
        return string + string
    }
}

export default NOP
