import logger from '../../../utils/Logger.js'
import Processor from '../../../model/Processor.js'

class AppendProcess extends Processor {

    // In AppendProcess.js
    async process(message) {
        logger.debug("AppendProcess data : " + message.content)
        message.content = message.content + " world"
        return this.emit('message', message)
    }
}

export default AppendProcess