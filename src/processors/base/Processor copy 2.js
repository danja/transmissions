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
        logger.debug(`Processor.getProperty, this.node.value = ${this.node.value}`)

        const shortName = ns.getShortname(property)
        if (this.message && this.message[shortName]) {
            logger.debug(`Found in message: ${this.message[shortName]}`)
            return this.message[shortName]
        }

        const settingsValue = this.getPropertyFromSettings(property)
        if (settingsValue) {
            logger.debug(`Found in settings: ${settingsValue.value}`)
            return settingsValue.value
        }

        logger.debug(`Using fallback: ${fallback}`)
        return fallback
    }

    getPropertyFromSettings(property) {
        if (!this.config || !this.node) {
            logger.debug('Config or node missing')
            return undefined
        }

        try {
            const dataset = this.config
            const ptr = grapoi({ dataset, term: this.node })

            logger.debug(`Checking property ${property} on node ${this.node.value}`)
            let values = ptr.out(property)
            if (values.terms.length > 0) {
                logger.debug(`Found direct property value: ${values.term.value}`)
                return values.term
            }
            logger.debug('No direct property found')

            // Debug full path
            logger.debug(`Full dataset: ${[...dataset].map(q => `${q.subject.value} ${q.predicate.value} ${q.object.value}`).join('\n')}`)

            const settings = ptr.out(ns.trn.settings)
            logger.debug(`Settings query result: ${settings?.terms?.length} terms`)
            if (settings.terms.length > 0) {
                const settingsId = settings.term
                logger.debug(`Found settings reference: ${settingsId.value}`)

                const settingsPtr = grapoi({ dataset, term: settingsId })
                const settingsValues = settingsPtr.out(property)
                if (settingsValues.terms.length > 0) {
                    logger.debug(`Found settings property value: ${settingsValues.term.value}`)
                    return settingsValues.term
                }
                logger.debug('No property found in settings')
            }
            logger.debug('No settings reference found')
            return undefined

        } catch (err) {
            logger.debug(`Error getting property ${property}: ${err}`)
            return undefined
        }
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

export default Processor