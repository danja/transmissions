import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'

// OLD : PRE-REFACTOR
class StringMerger extends ProcessProcessor {
    constructor(config) {
        super(config)
        this.merged = ''
    }

    async process(message) {
        logger.log('SMDATA*********************************\n' + data)

        if (data === '~~done~~') {
            logger.log('SM  DONE**********************************\n' + this.merged)
            return this.emit('message', this.merged, message)
            return
        }
        this.merged = this.merged + data

    }
}

export default StringMerger