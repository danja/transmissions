import { EventEmitter } from 'events'
import logger from '../utils/Logger.js'
import ns from '../utils/ns.js'
import SysUtils from '../utils/SysUtils.js'
import ProcessorSettings from './ProcessorSettings.js'

class ProcessorImpl extends EventEmitter {
    constructor(app) {
        super()
        this.app = app
        this.settingsNode = null
        this.settee = new ProcessorSettings(this.app)
        this.messageQueue = []
        this.processing = false
        this.outputs = []
        logger.debug(`ProcessorImpl.constructor : \n${this}`)
    }

    getValues(property, fallback) {
        return this.settee.getValues(this.settingsNode, property, fallback)
    }

    getProperty(property, fallback = undefined) {
        // Defensive: ensure this.message is set if called directly
        if (!this.message && arguments.length > 2 && typeof arguments[2] === 'object') {
            this.message = arguments[2]
        }
        logger.debug(`   ProcessorImpl.getProperty looking for ${property}`)
        // first check if the property is in the message
        var value = this.propertyInMessage(property)
        if (value) {
            logger.debug(`   property found in message : ${value}`)
            return value
        }

        // If not found in message, check the settings
        logger.debug(`   this.settingsNode = ${this.settingsNode?.value}`)
        logger.debug(`   typeof this.settingsNode = ${typeof this.settingsNode}`)

        // this.settee.configDataset = this.configDataset // TODO probably not needed
        //logger.trace(`   this.configDataset : ${this.configDataset}`)
        // Get values from settings
        const values = this.settee.getValues(this.settingsNode, property, fallback)

        // If it's a single value, return it directly, otherwise return the array
        if (values && Array.isArray(values)) {
            if (values.length === 1) {
                return values[0]
            } else if (values.length > 1) {
                return values
            }
        }

        return fallback
    }

    propertyInMessage(property) {
        logger.debug(`   ProcessorImpl.propertyInMessage
            property = ${property}`)
        const shortName = ns.getShortname(property)
        logger.debug(`   shortName = ${shortName}`)
        logger.debug(`   this.message = ${logger.reveal(this.message)}`)

        if (this.message && this.message[shortName]) {
            logger.debug(`   Found in message: ${this.message[shortName]}`)
            return this.message[shortName]
        }
        return undefined
    }

    preProcess(message) {
        logger.debug('ProcessorImpl.preProcess')


        if (message.onProcess) { // Claude
            message.onProcess(this, message)
        }

        this.previousLogLevel = logger.getLevel()

        // TODO make it loglevel value
        const loglevel = this.getProperty(ns.trn.loglevel)

        if (loglevel) {
            logger.setLogLevel(loglevel)
        }
        logger.debug(`   loglevel = ${loglevel}`)

        /* TODO uncomment after config sorted
        const messageType = this.getProperty(ns.trn.messageType)
        if (messageType) {
            if (messageType.value) {
                message.messageType = messageType.value
            } else {
                message.messageType = messageType
            }
        }
            */
        this.message = message
    }

    /**
     * Default process method for ProcessorImpl.
     * Subclasses should override this method.
     * @param {Object} message - The message object to process.
     * @returns {Promise<Object>} The processed message (by default, just emits it).
     */
    async process(message) {
        logger.debug('ProcessorImpl.process: default implementation, just emits message')
        // By default, just emit the message and return it
        return super.emit('message', message)
    }

    // Add default properties to avoid property errors in toString and getTag
    id = ''
    label = ''
    type = undefined
    description = ''
    settings = undefined
    config = undefined

    // Patch: fix toString type property access
    toString() {
        const settingsNodeValue = this.settingsNode ? this.settingsNode.value : 'none'
        let typeValue = ''
        try {
            if (
                this.type &&
                typeof this.type === 'object' &&
                this.type !== null &&
                Object.prototype.hasOwnProperty.call(this.type, 'value') &&
                typeof this.type['value'] === 'string'
            ) {
                typeValue = this.type['value']
            }
        } catch (e) {
            typeValue = ''
        }
        return `
=== Processor ${this.constructor.name} ===
    id = ${this.id || ''}
    label = ${this.label || ''}
    type = ${typeValue}
    description = ${this.description || ''}
    settingsNodeValue = ${settingsNodeValue}
    settings = ${this.settings || ''}
    config = ${this.config || ''}
       `
    }

    async postProcess(message) {
        // Only set log level if previousLogLevel is a string
        if (typeof this.previousLogLevel === 'string' || typeof this.previousLogLevel === 'undefined') {
            logger.setLogLevel(this.previousLogLevel)
        }
        this.previousLogLevel = null
    }

    async receive(message) {
        await this.enqueue(message)
    }

    async enqueue(message) {
        this.messageQueue.push({ message })
        if (!this.processing) {
            await this.executeQueue()
        }
    }

    async executeQueue() {
        logger.debug(`ProcessorImpl.executeQueue`)
        this.processing = true
        while (this.messageQueue.length > 0) {
            let { message } = this.messageQueue.shift()
            message = SysUtils.copyMessage(message)
            this.addTag(message)
            logger.debug(`  before`)
            await this.preProcess(message)
            logger.debug(`  after`)
            await this.process(message)
            await this.postProcess(message) // pass message argument
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
    }

    getTag() {
        return ns.shortName(this.id)
    }

    getOutputs() {
        const results = this.outputs
        this.outputs = []
        return results
    }
}

export default ProcessorImpl