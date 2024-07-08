import { EventEmitter } from 'events'
import logger from '../utils/Logger.js'
import footpath from '../utils/footpath.js'

class Connector extends EventEmitter {


    constructor(fromName, toName) {
        super();
        this.fromName = fromName
        this.toName = toName
    }

    connect(services) {
        let fromService = services[this.fromName]
        let toService = services[this.toName]

        fromService.on('message', (message) => { //  = {}
            var tags = ''
            //     if (toService.message) {
            tags = ' (' + fromService.message.tags + ') '
            toService.tags = tags // TODO tidy
            //   }
            const thisTag = footpath.urlLastPart(this.toName)
            logger.log("| Running : " + tags + thisTag + " a " + toService.constructor.name)

            toService.receive(message)
        })
    }


}

export default Connector