import logger from '../../utils/Logger.js'
import { EventEmitter } from 'events'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import footpath from '../../utils/footpath.js'
import ProcessorSettings from './ProcessorSettings.js'

/**
 * Base class for processors.
 * @extends EventEmitter
 */
class Processor extends EventEmitter {

    /**
     * Creates an instance of Processor.
     * @param {Object} config - The configuration object for the processor.
     */
    constructor(config) {
        super()
        this.config = config
        this.settings = new ProcessorSettings(config)
        this.messageQueue = []
        this.processing = false
        this.done = false
        this.outputs = []
    }

    async preProcess(message) {
        logger.debug("Processor.preProcess")
        this.message = message
        return
        /* NOPE
        if (message.done) {
            this.emit('message', message)
            return true
        }
        return false
        */
        const processorPoi = rdf.grapoi({ dataset: this.config, term: this.configKey })
        //    logger.log('this.configKey = ' + this.configKey.value)
        //   logger.poi(processorPoi)

        // logger.log('describe Desc')
        if (this.configKey.value === ns.trn.describe.value) {
            this.describe()
        }
        // nowe get the bits
        // process.exit()

    }

    async postProcess(message) {
        logger.debug("Processor.postProcess")
        return
    }

    describe() {
        logger.log('describe')
        const inputs = this.getInputKeys()
        const outputs = this.getOutputKeys()
        for (var input of inputs) {
            logger.log('input = ' + input)
            logger.log(this.message[input] + ' = ' + this.message[input])
        }
        for (var output of outputs) {
            logger.log('output = ' + output)
            logger.log(this.message[output] + ' = ' + this.message[output])
        }
    }

    toString() {
        return this.constructor.name
    }

    /**
     * TODO refactor
     *
     * Locates the configuration node in processors.ttl for the processor.
     * @returns {Object} - The configuration node.
     */
    // is this duplicating? getMyConfig()
    /*
        getMyConfig() {
            const dataset = this.config
            const poi = grapoi({ dataset, term: this.configKey }).in()
            const configNode = poi.out(ns.trn.value)
            return configNode
        }
    */
    /** SHOULD REPLACE THE ABOVE AND USE THE BLOCK NAME FOR ID
 * Locates the configuration node in processors.ttl for the processor.
 * @returns {Object} - The configuration node.
 */

    getMyPoi() {
        const dataset = this.config
        /*
        const myConfigNode = this.getMyConfigNode()
        const poi = grapoi({ dataset: dataset, term: myConfigNode })
        */
        const poi = grapoi({ dataset: this.config, term: this.node })
        // rdf.grapoi({ dataset, term: 'Gregory' }).in().trim()
        return poi
    }

    getProperty(property, fallback) {
        //     return this.settings.getValue(property, fallback)

        logger.debug(`Processor.getProperty, this.id = ${this.id}`)
        logger.debug(`this.node.value = ${this.node.value}`)
        logger.debug(`getMyConfigNode().value = ${this.getMyConfigNode().value}`)


        const poi = this.getMyPoi()
        // logger.log(`PPPPPPPPPPPPPP ${poi.out(property).term}`)
        logger.debug(`PROPERTY = ${property}`)


        const shortName = ns.getShortname(property)

        logger.debug(`PROPERTY = ${property}`)
        this.showMyConfig()

        if (this.message[shortName]) return this.message[shortName]

        // MANIFEST IS WHERE?
        const maybe = this.getPropertyFromMyConfig(property)
        //  this.showMyConfig()
        logger.log(`maybe = ${maybe}`)
        if (maybe) return maybe
        return fallback

    }

    getPropertyFromMyConfig(property) {
        if (this.config.simples) {
            //  const shortName = property.value.split('/').pop()
            const shortName = ns.getShortname(property)
            logger.debug(`Processor (simples), property = ${shortName}`)
            const value = this.config[shortName]
            logger.debug(`Processor (simples), value = ${value}`)
            return value
        }

        const poi = grapoi({ dataset: this.config, term: this.node })
        // const poi = this.getMyPoi()
        logger.log(`LOOKING FOR ${property}`)
        logger.log(poi)
        try {
            return poi.out(property).term.value

        } catch (err) {
            const id = ns.shortName(this.id)
            const type = ns.shortName(this.type.value)
            logger.debug(`\n* Warn : Processor.getPropertyFromMyConfig() for ${type} ${id}, property ${property} not defined *\n`)
            //  return rdf.literal('undefined')
            return undefined
        }
    }

    getMyConfigNode() {
        const dataset = this.config
        const myPoi = grapoi({ dataset, term: this.node })
        logger.debug(`myPoi = ${myPoi}`)
        //    logger.reveal(myPoi)
        //.out(ns.trn.configKey)
        return this.node
    }
    /*
getMyConfigNode() {
    const dataset = this.config
    //    const configNode = grapoi({ dataset, term: this.configKey }).in()
    const configNode = grapoi({ dataset, term: this.configKey }).in()
    return configNode.term
}
*/


    async addPropertyToMyConfig(predicate, value) {
        logger.log('addPropertyToMyConfig predicate = ' + predicate)
        logger.log('addPropertyToMyConfig value = ' + value)
        const myConfigNode = this.getMyConfigNode()
        const s = myConfigNode.value
        logger.log('addPropertyToMyConfig  myConfigNode.value = ' + myConfigNode.value)
        const dataset = this.config
        dataset.add(myConfigNode, predicate, value)
        this.config = dataset
    }

    showMyConfig() {
        const poi = this.getMyPoi()
        logger.log('POI = ')
        logger.poi(poi)
    }



    async deletePropertyFromMyConfig(predicate, value) {
        const myConfigNode = this.getMyConfigNode()
        const s = myConfigNode.value
        logger.log('DELETING FROM ' + s)
        const dataset = this.config
        dataset.delete(myConfigNode, predicate, value)
        this.config = dataset
    }

    /**
     * Receives data and message for processing.
     * @param {*} data - The data to be processed.
     * @param {*} message - The message for processing.
     */
    async receive(message) {
        await this.enqueue(message)
    }

    /**
     * Enqueues data and message for processing.
     * @param {*} data - The data to be processed.
     * @param {*} message - The message for processing.
     */
    async enqueue(message) {
        this.messageQueue.push({ message })
        if (!this.processing) {
            this.executeQueue()
        }
    }



    /**
     * Executes the message queue.
     */
    async executeQueue() {
        this.processing = true
        while (this.messageQueue.length > 0) {
            let { message } = this.messageQueue.shift()

            logger.log('\n\nHERE')
            //     logger.log(message.dataset)
            //     logger.reveal(message.dataset)

            // totes decoupling - is needed?
            //    const dataset = structuredClone(message.dataset)
            message = structuredClone(message)
            // message.dataset = dataset
            this.addTag(message)

            /* PREVIOUS VERSION
message = this.cloneContext(message)// TODO make optional
this.message = message // IS OK? needed where?
*/


            // message = structuredClone(message) // TODO make optional
            // message.dataset = dataset
            // no idea why this ^^ was necessary, without it the dataset wasn't usable
            // structuredClone(message, {transfer:[dataset]}) failed too

            // Preserve done status through processing chain
            //const isDone = message.done
            // message.done = false

            await this.preProcess(message)
            logger.log(`HERE in ${this.type.value} ${this.id}`)
            await this.process(message)
            await this.postProcess(message)

            // Restore done status after processing
            //  message.done = isDone
        }
        this.processing = false
    }

    addTag(message) {
        const tag = this.getTag()
        if (!message.tags) {
            message.tags = tag
            return
        }
        message.tags = message.tags + '.' + tag
        //   logger.log('in Processor, tags = ' + message.tags)
    }

    getTag() {
        return footpath.urlLastPart(this.id)
    }


    /**
     * Executes the processing logic for the processor.
     * @param {*} data - The data to be processed.
     * @param {*} message - The message for processing.
     */
    async process(message) {
        throw new Error('execute method not implemented')
    }

    /**
     * Emits a message. TODO now redundant?
     * @param {string} message - The message to emit.
     * @param {*} data - The data to emit.
     * @param {*} message - The message for emitting.
     */
    async doEmit(message) {
        await this.emit(message)
    }

    /////////////////////// for simples
    //  emit(event, message) {

    // }

    //    this.emit('message', message)
    //  return this.getOutputs()
    /*
    async forward(event = 'message', message) {
        if (event === 'message') {
            this.outputs.push(message)
        }
        super.emit(event, message)
        return this.getOutputs()
    }
*/

    // Claude suggested :

    async emit(event, message) {
        logger.log(`Processor.emit called with ${message.done}`)
        await new Promise(resolve => {
            super.emit(event, message)
            resolve()
            logger.log(`after resolve has ${message.done}`)
        })
        return message
    }


    // previous
    /*
       emit(event, message) {
            super.emit(event, message)
            return message
        }
    */

    getOutputs() {
        const results = this.outputs

        this.outputs = []
        return results
    }
}

export default Processor