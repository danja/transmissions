import { EventEmitter } from 'events'
import logger from '../utils/Logger.js'
import footpath from '../utils/footpath.js'

class Connector extends EventEmitter {


    constructor(fromName, toName) {
        super()
        this.fromName = fromName
        this.toName = toName
    }

    connect(processors) {
        logger.log(`Connector.connect this.fromName = ${this.fromName} this.toName =  ${this.toName}`)
        let fromProcessor = processors[this.fromName]
        let toProcessor = processors[this.toName]

        if (!fromProcessor) {
            throw new Error(`\nMissing processor : ${this.fromName}, going to ${this.toName} \n(check for typos in transmissions.ttl)\n`)
        }

        /*
        fromProcessor.on('message', (message) => { //  = {}
            var tags = ''
            //     if (toProcessor.message) {
            tags = ' [' + fromProcessor.message.tags + '] '
            toProcessor.tags = tags // TODO tidy
            //   }
            const thisTag = footpath.urlLastPart(this.toName)
            logger.log("| Running >>> : " + tags + thisTag + " a " + toProcessor.constructor.name)

            toProcessor.receive(message)
        })
            */

        // previous lacked async
        fromProcessor.on('message', async (message) => {
            var tags = fromProcessor.message?.tags ? ` [${fromProcessor.message.tags}] ` : ''
            toProcessor.tags = tags
            logger.log(`Running >>> : ${tags} ${toProcessor.constructor.name}`)
            await toProcessor.receive(message)
        })

    }


}

export default Connector