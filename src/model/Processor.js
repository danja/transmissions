import { EventEmitter } from 'events'
import logger from '../utils/Logger.js'
import ns from '../utils/ns.js'
import SysUtils from '../utils/SysUtils.js'
import ProcessorSettings from '../engine/ProcessorSettings.js'

class Processor extends EventEmitter {
    constructor(config) {
        super()
        this.config = config
        this.settee = new ProcessorSettings(this.config)
        this.messageQueue = []
        this.processing = false
        this.outputs = []
    }

    // TODO needed?
    getAppPath(relativePath) {
        if (!this.app?.rootDir) {
            throw new Error('Application context not available')
        }
        return path.join(this.app.rootDir, relativePath)
    }

    // TODO tidy up
    getValues(property, fallback) {
        return this.settee.getValues(this.settingsNode, property, fallback)
    }

    getProperty(property, fallback = undefined) {
        logger.trace(`\nProcessor.getProperty looking for ${property}`)
        // first check if the property is in the message
        var value = this.propertyInMessage(property)
        if (value) {
            logger.trace(`property found in message : ${value}`)
            return value
        }
        logger.trace(`\nProcessor.getProperty this.settingsNode = ${this.settingsNode}`)
        logger.trace(`\nProcessor.getProperty    typeof this.settingsNode = ${typeof this.settingsNode}`)

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
        const shortName = ns.getShortname(property)
        if (this.message && this.message[shortName]) {
            logger.trace(`Found in message: ${this.message[shortName]}`)
            return this.message[shortName]
        }
        return undefined
    }

    async preProcess(message) {

        this.app = message.app
        // this.config.app = this.app // ??????????
        this.settee.app = this.app
        //    logger.log(`THIS APP = ${this.app}`)

        if (message.onProcess) { // Claude
            message.onProcess(this, message)
        }

        this.previousLogLevel = logger.getLevel()


        const debug = this.getProperty(ns.trn.debug)

        if (debug) {
            logger.setLogLevel('debug')
        }
        logger.debug(`Processor.preProcess, debug = ${debug}`)

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

    /*
async process(message) {
    throw new Error('process method not implemented')
}
*/

    /* cLAUDE
    // is useful?
    async process(message) {
        if (message.onProcess) {
            message.onProcess(this, message)
        }
        await this.emit('message', message)
    }
*/

    async postProcess(message) {
        logger.setLogLevel(this.previousLogLevel)
        this.previousLogLevel = null
    }

    async receive(message) {
        await this.enqueue(message)
    }

    async enqueue(message) {
        this.messageQueue.push({ message })
        if (!this.processing) {
            this.executeQueue()
        }
    }

    async executeQueue() {
        this.processing = true
        while (this.messageQueue.length > 0) {
            let { message } = this.messageQueue.shift()

            /* structuredClone makes a deep copy of the message object
            *  so that the original message is not modified
            *  except its depth doesn't appear to cover internal objects
            *  so here the app.dataset is passed between messages
            *  (which is fine)
            */
            //            const dataset = message.app.dataset
            //          message = structuredClone(message)
            //        message.app.dataset = dataset
            message = SysUtils.copyMessage(message)

            this.addTag(message)
            logger.trace(`BEFORE PRE`)
            await this.preProcess(message)
            logger.trace(`AFTER PRE`)
            await this.process(message)
            await this.postProcess(message)
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

    async emit(event, message) {
        await new Promise(resolve => {
            super.emit(event, message)
            resolve()
        })
        return message
    }

    getOutputs() {
        const results = this.outputs
        this.outputs = []
        return results
    }

    toString() {
        logger.reveal(this.settings)
        logger.reveal(this.app.transmissionConfig)

        const settingsNodeValue = this.settingsNode ? this.settingsNode.value : 'none'
        return `
        *** Processor ${this.constructor.name}
                id = ${this.id}
                label = ${this.label}
                type = ${this.type}
                description = ${this.description}
                settingsNodeValue = ${settingsNodeValue}
                settings = ${this.settings}
                 x = ${this.x}
              
       `
    }
}

export default Processor