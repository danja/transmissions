import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class Templater extends ProcessService {
    constructor(config) {
        super(config)

    }

    async execute(data, context) {

        this.emit('message', this.merged, context)
    }
}

export default Templater