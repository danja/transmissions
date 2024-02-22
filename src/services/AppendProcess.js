import logger from '../utils/Logger.js'
import Process from '../mill/ProcessService.js';

class AppendProcess extends Process {

    async execute(data, config) {
        return process(data)

        process(input) {
            logger.log("AppendProcess.process : " + input)
            let output = input + " world"
            return output
        }
    }

export default AppendProcess