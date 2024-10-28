import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
import ns from '../../utils/ns.js'

class NOP extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {


        logger.log('NOP at (' + message.tags + ') ' + this.getTag())
        //  logger.log('NOP, this.config.targetDir = ' + this.config.targetDir)
        return this.emit('message', message)
        //  return this.getOutputs()
    }
}
export default NOP
