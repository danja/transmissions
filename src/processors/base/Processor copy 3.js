import { EventEmitter } from 'events'
import grapoi from 'grapoi'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import footpath from '../../utils/footpath.js'

class Processor extends EventEmitter {
    constructor(config) {
        super()
        this.config = config
        this.messageQueue = []
        this.processing = false
        this.outputs = []
    }

    getProperty(property, fallback) {
        logger.debug(`Processor.getProperty looking for ${property}`)

        if (!this.config || !this.node) {
            logger.debug('No config or node available')
            return fallback
        }

        // First check settings reference
        const settingsQuad = [...this.config.match(
            this.node,
            ns.trn.settings,
            null
        )][0]

        if (settingsQuad) {
            // Look for property in referenced settings
            const propertyQuad = [...this.config.match(
                settingsQuad.object,
                property,
                null
            )][0]

            if (propertyQuad) {
                logger.debug(`Found property value: ${propertyQuad.object.value}`)
                return propertyQuad.object.value
            }
        }

        // Fallback to direct property on processor node
        const directQuad = [...this.config.match(
            this.node,
            property,
            null
        )][0]

        if (directQuad) {
            logger.debug(`Found direct property value: ${directQuad.object.value}`)
            return directQuad.object.value
        }

        logger.debug(`No property found, using fallback: ${fallback}`)
        return fallback
    }

    async preProcess(message) {
        this.message = message
        logger.debug("Processor.preProcess")
    }

    async postProcess(message) {
        logger.debug("Processor.postProcess")
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
            message = structuredClone(message)
            this.addTag(message)

            await this.preProcess(message)
            await this.process(message)
            await this.postProcess(message)
        }
        this.processing = false
    }

    async process(message) {
        throw new Error('process method not implemented')
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
        return footpath.urlLastPart(this.id)
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
}

export default Processor;