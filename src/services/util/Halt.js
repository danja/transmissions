import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class Halt extends Service {

    execute(context) {
        logger.log('\n************************************************************************')
        logger.log('*** << Thou Hast Summoned HALT, the Mighty Stopper of All Things  >> ***')
        logger.log('*** <<                   ~~~ ALL IS GOOD ~~~                      >> ***')
        logger.log('*** <<                     Have a nice day!                       >> ***')
        logger.log('************************************************************************\n')
        logger.log('*** Pipeline was : ' + context.tags)
        logger.log('*** Context now : ')
        logger.reveal(context)
        process.exit() // all good
    }
}

export default Halt
