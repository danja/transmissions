import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class AppendProcess extends ProcessService {

    // In AppendProcess.js
    async execute(message) {
        logger.debug("AppendProcess data : " + message.content)
        message.content = message.content + " world"
        this.emit('message', message)
    }
}

export default AppendProcess