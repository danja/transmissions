import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import chalk from 'chalk'

class ShowMessage extends Processor {

    constructor(config) {
        super(config)
        this.verbose = false
    }

    async process(message) {
        //   if (this.verbose) logger.log("\n***  Show Message ***")

        logger.log(chalk.bgYellow.black('\nMessage vvvvvvvvvvvvvvvvvvvvvvvv'))
        logger.rv(message)
        logger.log(chalk.bgYellow.black('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^'))
        //     logger.log("***  Trace")
        //   console.trace() // move to Logger, only when debugging
        // logger.log("***************************")

        return this.emit('message', message)
    }
}

export default ShowMessage
