import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
/*
only accept the first call
*/

class Unfork extends Service {

    constructor(config) {
        super(config)
    }

    async execute(data, context) {
        if (!this.done) {
            this.emit('message', false, context)
        } else {
            logger.log('DONE')
        }
    }

}

export default Unfork
