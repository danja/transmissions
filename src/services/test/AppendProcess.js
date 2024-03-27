import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class AppendProcess extends ProcessService {

    async execute(input, context) {
        logger.debug("AppendProcess.process : " + input)
        let output = input + " world"
        //  return output
        this.emit('data', output, context)
    }
}

export default AppendProcess