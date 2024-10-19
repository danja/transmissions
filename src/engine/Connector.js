import { EventEmitter } from 'events'
import logger from '../utils/Logger.js'
import footpath from '../utils/footpath.js'

class Connector extends EventEmitter {


    constructor(fromName, toName) {
        super();
        this.fromName = fromName
        this.toName = toName
    }

    connect(processors) {
        logger.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
        logger.log(`Connector.connect this.fromName = ${this.fromName} this.toName =  ${this.toName}`)
        logger.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
        let fromProcessor = processors[this.fromName]
        let toProcessor = processors[this.toName]

        fromProcessor.on('message', (message) => { //  = {}
            var tags = ''
            //     if (toProcessor.message) {
            tags = ' (' + fromProcessor.message.tags + ') '
            toProcessor.tags = tags // TODO tidy
            //   }
            const thisTag = footpath.urlLastPart(this.toName)
            logger.log("| Running : " + tags + thisTag + " a " + toProcessor.constructor.name)

            toProcessor.receive(message)
        })
    }


}

export default Connector