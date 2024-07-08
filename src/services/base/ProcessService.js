import logger from '../../utils/Logger.js'
import Service from './Service.js'

class ProcessService extends Service {
    constructor(config) {
        super(config)
    }


    async execute(message) {
        this.emit('message', message)
    }
}

export default ProcessService