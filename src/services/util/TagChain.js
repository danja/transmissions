import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class TagChain extends Service {

    async execute(data, context) {
        this.emit('message', data, context)
    }
}

export default TagChain
