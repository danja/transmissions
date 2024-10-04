import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class NOP extends Processor {

    constructor(config) {
        super(config);
    }

    async execute(message) {

        logger.log('NOP at (' + message.tags + ') ' + this.getTag())
        return this.emit('message', message)
        //  return this.getOutputs()
    }
}
export default NOP
