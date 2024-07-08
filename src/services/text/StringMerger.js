import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class StringMerger extends ProcessService {
    constructor(config) {
        super(config)
        this.merged = ''
    }

    async execute(message) {
        logger.log('SMDATA*********************************\n' + data)

        if (data === '~~done~~') {
            logger.log('SM  DONE**********************************\n' + this.merged)
            this.emit('message', this.merged, message)
            return
        }
        this.merged = this.merged + data

    }
}

export default StringMerger