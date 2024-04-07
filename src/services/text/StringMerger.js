import logger from '../../utils/Logger.js'
import ProcessService from '../base/Service.js'

class StringMerger extends ProcessService {
    constructor(config) {
        super(config)
        this.merged = ''
    }

    async execute(data, context) {
        this.merged = this.merged + data
        if (data != '~done~') {
            this.emit('message', this.merged, context)
            return
        }


    }

}

export default StringMerger