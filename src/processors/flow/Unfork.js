import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import DeadEnd from './DeadEnd.js'
/*
TODO move to ./flow

only accept the first call
*/

class Unfork extends Processor {

    constructor(config) {
        super(config)

        /* NOPE
        if (Unfork._instance) {
            return new DeadEnd(config)
        }
        Unfork._instance = this;
*/
    }

    async process(message) {
        //     logger.setLogLevel("debug")
        logger.debug(`Unfork got message with done=${message.done}, tags=${message.tags}`)

        logger.debug('Unfork ----')
        if (message.done) {
            logger.debug(' - Unfork passing message >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            message.done = false // in case it's needed later

            /*
                        await new Promise(resolve => {
                            //    super.emit(event, message)
                            return this.emit('message', message)
                            resolve()
                            logger.log(`after resolve has ${message.done}`)
                        })
            */
            return this.emit('message', message)
        } else {
            logger.debug(' - Unfork terminating pipe')
            return
        }
    }
}
export default Unfork
