import ns from '../utils/ns.js'
import { EventEmitter } from 'events'
import logger from '../utils/Logger.js'
import Transmission from './Transmission.js'

class Connector extends EventEmitter {

    constructor(fromName, toName) {
        super()
        this.fromName = fromName
        this.toName = toName
    }

    connect(processors) {
        logger.trace(`Connector.connect this.fromName = ${this.fromName} this.toName =  ${this.toName}`)
        const fromProcessor = processors[this.fromName]
        const toProcessor = processors[this.toName]
        if (fromProcessor instanceof Transmission && toProcessor instanceof Transmission) {
            // Connect last node of from-transmission to first node of to-transmission
            const lastNode = fromProcessor.getLastNode()
            const firstNode = toProcessor.getFirstNode()
            lastNode.on('message', async (message) => {
                await firstNode.receive(message)
            })
        } else if (fromProcessor instanceof Transmission) {
            // Connect last node of nested transmission
            const lastNode = fromProcessor.getLastNode()
            lastNode.on('message', async (message) => {
                await toProcessor.receive(message)
            })
        } else if (toProcessor instanceof Transmission) {
            // Connect to first node of nested transmission
            fromProcessor.on('message', async (message) => {
                const firstNode = toProcessor.getFirstNode()
                await firstNode.receive(message)
            })
        } else {
            if (!fromProcessor) {
                throw new Error(`\nMissing processor : ${this.fromName}, going to ${this.toName} \n(check for typos in transmissions.ttl)\n`)
            }

            fromProcessor.on('message', async (message) => {
                var tags = fromProcessor.message?.tags ? ` [${fromProcessor.message.tags}] ` : ''
                toProcessor.tags = tags
                logger.log(`|-> ${tags}-> ${ns.shortName(toProcessor.id)} a ${toProcessor.constructor.name}`)
                await toProcessor.receive(message)
            })
        }

    }


}

export default Connector