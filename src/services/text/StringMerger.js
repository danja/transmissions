import logger from '../../utils/Logger.js'
import ProcessService from '../base/Service.js'

class StringMerger extends ProcessService {
    constructor(config) {
        super(config)
        this.merged = ''
    }

    async execute(data, context) {
        logger.log('SMDATA*********************************\n' + data)

        if (data === '~~done~~') {
            logger.log('SM  DONE**********************************\n' + this.merged)
            this.emit('message', this.merged, context)
            return
        }
        this.merged = this.merged + data

    }
}

export default StringMerger