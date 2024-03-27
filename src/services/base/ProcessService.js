import logger from '../../utils/Logger.js'
import Service from './Service.js'

class ProcessService extends Service {
    constructor(config) {
        super(config)
    }

    async execute(data, context) {
        this.emit('data', data, context)
    }
}

export default ProcessService