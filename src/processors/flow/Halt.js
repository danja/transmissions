import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

// src/processors/flow/Halt.js
/**
 * @class Halt
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Stops the current process and exits the application.
 *
 * ### Processor Signature
 *
 * #### __*Behavior*__
 * * Logs a friendly halt message
 * * Outputs the current message tags and context
 * * Terminates the Node.js process with exit code 0 (success)
 *
 * #### __*Side Effects*__
 * * Logs information to the console
 * * Terminates the application process
 *
 * @note Use this processor with caution as it will immediately stop the application.
 * Intended for debugging and controlled shutdown scenarios.
 */
class Halt extends Processor {

    /**
     * Processes the message and halts the application.
     * @param {Object} message - The current message object
     * @returns {never} This method never returns as it terminates the process
     */
    process(message) {
        logger.log('\n************************************************************************')
        logger.log('*** << Thou Hast Summoned HALT, the Mighty Stopper of All Things  >> ***')
        logger.log('*** <<                   ~~~ ALL IS GOOD ~~~                      >> ***')
        logger.log('*** <<                     Have a nice day!                       >> ***')
        logger.log('************************************************************************\n')
        logger.log('*** Transmission was : ' + message.tags)
        logger.log('*** Context now : ')
        logger.reveal(message)
        process.exit() // all good
    }
}

export default Halt
