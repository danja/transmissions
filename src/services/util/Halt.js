import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class Halt extends Service {

    execute(data, context) {
        logger.log('*** Thou Hast Summoned Mighty Halt, the Stopper of All Things Running ***')
        process.exit() // all good
    }
}

export default Halt
