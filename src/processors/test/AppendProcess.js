import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'

class AppendProcess extends ProcessProcessor {

    // In AppendProcess.js
    async process(message) {
        logger.debug("AppendProcess data : " + message.content)
        message.content = message.content + " world"
        return this.emit('message', message)
    }
}

export default AppendProcess