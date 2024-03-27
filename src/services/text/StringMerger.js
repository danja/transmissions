import logger from '../../utils/Logger.js'
import ProcessService from '../base/Service.js'

class StringMerger extends ProcessService {
    constructor(config) {
        super(config)
        this.merged = ''
    }

    async execute(data, context) {
        if (data != '~done~') {
            this.merged = this.merged + data
            return
        }

        this.emit('message', data, context)
    }

}

export default StringMerger