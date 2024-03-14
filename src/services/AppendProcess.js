import logger from '../utils/Logger.js'
import ProcessService from '../mill/ProcessService.js';

class AppendProcess extends ProcessService {

    async execute(input) {
        logger.debug("AppendProcess.process : " + input)
        let output = input + " world"
        //  return output
        this.emit('data', output)
    }
}

export default AppendProcess