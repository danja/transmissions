import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

/*
only accept the first call
*/

class Unfork extends Service {

    async execute(data, context) {
        const called = await this.alreadyCalled()
        logger.log('CALLED = ' + called)
        if (!called) {
            logger.log('CALLING')
            await this.setCalled()
            this.emit('message', data, context)
        } else {
            logger.log('SKIPPING')
        }
    }

    async alreadyCalled() {
        // look in this.config
        return true
    }

    async setCalled() {

    }

    locateServiceNode() {

    }
}

export default Unfork
