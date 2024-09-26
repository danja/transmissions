import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'

class AppendProcess extends ProcessProcessor {

    // In AppendProcess.js
    async execute(message) {
        logger.debug("AppendProcess data : " + message.content)
        message.content = message.content + " world"
        this.emit('message', message)
    }
}

export default AppendProcess