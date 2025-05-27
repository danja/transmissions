import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import chalk from 'chalk'

class ShowMessage extends Processor {

    constructor(config) {
        super(config)
        this.verbose = false
    }

    async process(message) {
        //   if (this.verbose) logger.log("\n***  Show Message ***")
        const alert = super.getProperty(ns.trn.alert, '      Show Message      ')
        const stringLimit = super.getProperty(ns.trn.stringLimit, '100')

        logger.log(chalk.bgBlue.yellowBright(`\n      ${alert}      `))
        logger.log(chalk.bgYellow.black('Message vvvvvvvvvvvvvvvvvvvvvvvv'))

        logger.v(message, false, parseInt(stringLimit))
        logger.log(chalk.bgYellow.black('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^'))
        //     logger.log("***  Trace")
        //   console.trace() // move to Logger, only when debugging
        // logger.log("***************************")

        return this.emit('message', message)
    }
}

export default ShowMessage
