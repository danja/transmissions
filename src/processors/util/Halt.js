import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class Halt extends Processor {

    process(message) {
        logger.log('\n************************************************************************')
        logger.log('*** << Thou Hast Summoned HALT, the Mighty Stopper of All Things  >> ***')
        logger.log('*** <<                   ~~~ ALL IS GOOD ~~~                      >> ***')
        logger.log('*** <<                     Have a nice day!                       >> ***')
        logger.log('************************************************************************\n')
        logger.log('*** Pipeline was : ' + message.tags)
        logger.log('*** Context now : ')
        logger.reveal(message)
        process.exit() // all good
    }
}

export default Halt
