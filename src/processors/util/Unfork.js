import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
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
        logger.setLogLevel("info")
        /* NOPE
        if (Unfork._instance) {
            return new DeadEnd(config)
        }
        Unfork._instance = this;
*/
    }

    async process(message) {

        if (message.done) {
            logger.debug(' - Unfork passing message')
            message.done = false // in case it's needed later
            this.emit('message', message)
        } else {
            logger.debug(' - Unfork terminating pipe')
        }
    }

}

export default Unfork
