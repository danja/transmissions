import logger from '../../utils/Logger.js'
import ProcessService from '../base/Service.js'

class StringFilter extends ProcessService {
    constructor(config) {
        super(config)
        this.reject = ['mailto:', 'example.org', 'wikipedia', 'wikimedia']
    }

    async execute(context) {
        logger.debug('StringFilter data = ' + data.toString())
        if (this.containsAny(data.toString(), this.reject)) return

        this.emit('message', context)
    }

    containsAny(contentString, matchers) {
        const contains = matchers.some(matcher => contentString.includes(matcher))
        console.log(contentString, contains)
        return contains
    }
}

export default StringFilter