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
        if (context.done) {
            context.done = false // in case it's needed later
            this.emit('message', false, context)
        }
    }

}

export default Unfork
