import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'


class Fork extends Service {

    constructor(config) {
        super(config)
    }

    /*
only for testing for now
*/
    async execute(data, baseContext) {

        for (let i = 0; i < 5; i++) {
            var context = this.cloneContext(baseContext)
            context.done = false
            logger.log('--- emit --- ' + i)
            this.emit('message', false, context)
        }
        var context = this.cloneContext(baseContext)
        context.done = true

        this.emit('message', false, context)

    }

}

export default Fork
