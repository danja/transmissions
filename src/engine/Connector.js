import ns from '../utils/ns.js'
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
        logger.trace(`Connector.connect this.fromName = ${this.fromName} this.toName =  ${this.toName}`)
        let fromProcessor = processors[this.fromName]
        let toProcessor = processors[this.toName]

        if (!fromProcessor) {
            throw new Error(`\nMissing processor : ${this.fromName}, going to ${this.toName} \n(check for typos in transmissions.ttl)\n`)
        }


        // previous lacked async
        fromProcessor.on('message', async (message) => {
            var tags = fromProcessor.message?.tags ? ` [${fromProcessor.message.tags}] ` : ''
            toProcessor.tags = tags
            logger.log(`|-> ${tags}-> ${ns.shortName(toProcessor.id)} a ${toProcessor.constructor.name}`)
            await toProcessor.receive(message)
        })

    }


}

export default Connector