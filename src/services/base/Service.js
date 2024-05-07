import logger from '../../utils/Logger.js'
import { EventEmitter } from 'events'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import footpath from '../../utils/footpath.js'

/**
 * Base class for services.
 * @extends EventEmitter
 */
class Service extends EventEmitter {

    /**
     * Creates an instance of Service.
     * @param {Object} config - The configuration object for the service.
     */
    constructor(config) {
        super()
        this.config = config
        this.messageQueue = []
        this.processing = false
        this.doneMessage = '~[DONE]~'
    }

    /**
     * TODO refactor
     * 
     * Locates the configuration node in services.ttl for the service.
     * @returns {Object} - The configuration node.
     */
    // is this duplicating? getMyConfig() 
    /*
        getMyConfig() {
            const dataset = this.config
            const poi = grapoi({ dataset, term: this.configKey }).in()
            const configNode = poi.out(ns.trm.value)
            return configNode
        }
    */
    /** SHOULD REPLACE THE ABOVE AND USE THE BLOCK NAME FOR ID
 * Locates the configuration node in services.ttl for the service.
 * @returns {Object} - The configuration node.
 */
    // is this duplicating? 
    getMyConfigNode() {
        const dataset = this.config
        const configNode = grapoi({ dataset, term: this.configKey }).in()
        // .trim()
        //  const configNode = poi.out(ns.trm.value)
        // rdf.namedNode(this.getMyConfigNode())
        return configNode.term
        // return configNode
    }

    getMyPoi() {
        const dataset = this.config
        const myConfigNode = this.getMyConfigNode()
        const poi = grapoi({ dataset: dataset, term: myConfigNode })
        return poi
    }

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
     * Receives data and context for processing.
     * @param {*} data - The data to be processed.
     * @param {*} context - The context for processing.
     */
    async receive(data, context) {
        await this.enqueue(data, context)
    }

    /**
     * Enqueues data and context for processing.
     * @param {*} data - The data to be processed.
     * @param {*} context - The context for processing.
     */
    async enqueue(data, context) {
        this.messageQueue.push({ data, context })
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
            let { data, context } = this.messageQueue.shift()
            var dataset = context.dataset
            //   dataset = structuredClone(context.dataset)
            context = structuredClone(context) // TODO make optional
            context.dataset = dataset
            // no idea why this ^^ was necessary, without it the dataset wasn't usable
            // structuredClone(context, {transfer:[dataset]}) failed too 
            this.addTag(context)
            await this.execute(data, context)
        }
        this.processing = false
    }

    addTag(context) {
        const tag = this.getTag()
        if (!context.tags) {
            context.tags = tag
            return
        }
        context.tags = context.tags + '.' + tag
        logger.log('context.tags = ' + context.tags)
    }

    getTag() {

        return footpath.urlLastPart(this.id)
    }


    /**
     * Executes the processing logic for the service.
     * @param {*} data - The data to be processed.
     * @param {*} context - The context for processing.
     */
    async execute(data, context) {
        throw new Error('execute method not implemented')
    }

    /**
     * Emits a message with data and context.
     * @param {string} message - The message to emit.
     * @param {*} data - The data to emit.
     * @param {*} context - The context for emitting.
     */
    async doEmit(message, data, context) {
        this.emit(message, data, context)
    }
}

export default Service
