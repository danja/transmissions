import logger from '../../utils/Logger.js'
import Processor from './Processor.js'

class ProcessProcessor extends Processor {
    constructor(config) {
        super(config)
    }


    async execute(message) {
        this.emit('message', message)
    }
}

export default ProcessProcessor