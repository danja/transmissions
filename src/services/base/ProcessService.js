import logger from '../../utils/Logger.js'
import Service from './Service.js'

class ProcessService extends Service {
    constructor(config) {
        super(config)
    }


    async execute(data, context) {
        this.emit('message', data, context)
    }
}

export default ProcessService