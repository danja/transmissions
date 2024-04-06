import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class NOP extends Service {

    async execute(data, context) {
        this.emit('message', data, context)
    }
}

export default NOP
