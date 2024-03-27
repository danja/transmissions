import logger from '../../utils/Logger.js'
import ProcessService from './Service.js'

class StringFilter extends ProcessService {
    constructor(config) {
        super(config);
    }

    async execute(data, context) {
        this.emit('message', data, context)
    }
}

export default StringFilter