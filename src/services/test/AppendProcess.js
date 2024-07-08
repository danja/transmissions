import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class AppendProcess extends ProcessService {

    async execute(input, message) {
        logger.debug("AppendProcess data : " + input)
        let output = input + " world"
        //  return output
        this.emit('message', output, message)
    }
}

export default AppendProcess