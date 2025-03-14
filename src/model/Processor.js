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

    // TODO move to ProcessorSettings
    getValues(property, fallback) {
        logger.debug(`Processor.getValues,
            looking for ${property}`)

        var value = this.propertyInMessage(property)
        if (value) {
            return [value]
        }

        this.settee.settingsNode = this.settingsNode
        const values = this.settee.getValues(property, fallback)
        logger.debug(`Processor.getValues values = ${values}`)
        return values
    }

    // TODO merge with above (& move to ProcessorSettings)
    getProperty(property, fallback = undefined) {
        logger.debug(`\nProcessor.getProperty looking for ${property}`)

        // first check if the property is in the message
        var value = this.propertyInMessage(property)
        if (value) {
            return value
        }

        if (this.settingsNode) logger.debug(`this.settingsNode = ${this.settingsNode.value}`)
        this.settee.settingsNode = this.settingsNode ////////////////////////////////////////////
        value = this.settee.getValue(property, fallback)
        logger.debug(`Processor.getProperty, value = ${value}`)
        return value
    }


    propertyInMessage(property) {
        const shortName = ns.getShortname(property)
        if (this.message && this.message[shortName]) {
            logger.debug(`Found in message: ${this.message[shortName]}`)
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

            await this.preProcess(message)
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
        const settingsNodeValue = this.settingsNode ? this.settingsNode.value : 'none'
        return `
        *** Processor ${this.constructor.name}
                id = ${this.id}
                label = ${this.label}
                type = ${this.type}
                description = ${this.description}
                settingsNodeValue = ${settingsNodeValue}
                settings = ${this.settings}
       `
    }
}

export default Processor