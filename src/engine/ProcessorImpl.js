// src/engine/ProcessorImpl.js
import { EventEmitter } from 'events'
import { trace, SpanStatusCode } from '@opentelemetry/api'
import logger from '../utils/Logger.js'
import ns from '../utils/ns.js'
import SysUtils from '../utils/SysUtils.js'
import ProcessorSettings from './ProcessorSettings.js'
import WorkerPool from './WorkerPool.js'

const tracer = trace.getTracer('transmissions-processor', '1.0.0')


class ProcessorImpl extends EventEmitter {

    // why these properties are not defined in the constructor?
    id = ''
    label = ''
    type = undefined
    description = ''
    settings = undefined
    config = undefined

    constructor(app) {
        super()
        this.app = app
        this.settingsNode = null
        this.settee = new ProcessorSettings(this.app)
        this.messageQueue = []
        this.processing = false
        this.noProcessWhenDone = false
        this.workerPool = null
        logger.trace(`ProcessorImpl.constructor : \n${this}`)
    }

    getValues(property, fallback) {
        return this.settee.getValues(this.settingsNode, property, fallback)
    }

    getPropertyObject(subject, property, fallback) {
        return this.settee.getValues(subject, property, fallback)[0]
    }

    getProperty(property, fallback = undefined) {
        if (!this.message && arguments.length > 2 && typeof arguments[2] === 'object') {
            this.message = arguments[2]
        }
        logger.debug(`   ProcessorImpl.getProperty looking for ${property}`)

        var value = this.propertyInObject(this.message, property)
        if (value) {
            logger.debug(`   property found in message : ${value}`)
            return value
        }

        value = this.propertyInObject(this.app.simpleConfig, property)
        if (value) {
            logger.debug(`   property found in simpleConfig : ${value}`)
            return value
        }

        logger.debug(`   this.settingsNode = ${this.settingsNode?.value}`)
        logger.debug(`   typeof this.settingsNode = ${typeof this.settingsNode}`)

        const values = this.settee.getValues(this.settingsNode, property, fallback)

        if (values && Array.isArray(values)) {
            if (values.length === 1) {
                return values[0]
            } else if (values.length > 1) {
                return values
            }
        }

        return fallback
    }

    propertyInObject(object, property) {
        const shortName = ns.getShortname(property)
        logger.trace(`       shortName = ${shortName}`)
        if (object && object[shortName]) {
            logger.debug(`   Found in object: ${object[shortName]}`)
            return object[shortName]
        } else {
            return undefined
        }
    }

    propertyInMessage(property) {
        logger.debug(`   ProcessorImpl.propertyInMessage
            property = ${property}`)
        const shortName = ns.getShortname(property)

        if (this.message && this.message[shortName]) {
            logger.debug(`   Found in message: ${this.message[shortName]}`)
            return this.message[shortName]
        }
        return this.propertyInObject(this.message, property)
    }

    async preProcess(message) {
        logger.debug('ProcessorImpl.preProcess')

        if (message.onProcess) {
            message.onProcess(this, message)
        }

        this.previousLogLevel = logger.getLevel()

        const loglevel = this.getProperty(ns.trn.loglevel, undefined)

        if (loglevel) {
            logger.setLogLevel(loglevel)
        }
        //   logger.debug(`   loglevel = ${loglevel}`)

        this.message = message
    }

    async process(message) {
        logger.debug('ProcessorImpl.process: default implementation, just emits message')
        return super.emit('message', message)
    }



    async postProcess(message) {
        //   if (typeof this.previousLogLevel === 'string' || typeof this.previousLogLevel === 'undefined') {
        logger.setLogLevel(this.previousLogLevel)
        // }
        //this.previousLogLevel = null
    }

    async receive(message) {
        return await this.enqueue(message)
    }

    async enqueue(message) {
        this.messageQueue.push({ message })
        if (!this.processing) {
            return await this.executeQueue()
        }
    }

    async executeQueue() {
        return await tracer.startActiveSpan('processor.executeQueue', {
            attributes: {
                'processor.class': this.constructor.name,
                'processor.id': this.id || 'unknown',
                'queue.initial_length': this.messageQueue.length
            }
        }, async (queueSpan) => {
            try {
                logger.debug(`ProcessorImpl.executeQueue`)

                const appWorkerPool = this.app.workerPool

                if (appWorkerPool) {
                    logger.debug('Workers detected but falling back to sequential processing - worker integration incomplete')
                    queueSpan.addEvent('worker_pool_fallback')
                    await this.processSequentially(queueSpan)
                } else {
                    queueSpan.addEvent('sequential_processing')
                    return await this.processSequentially(queueSpan)
                }

                queueSpan.setStatus({ code: SpanStatusCode.OK })
                queueSpan.setAttribute('queue.processed_count', this.messageQueue.length)
            } catch (error) {
                queueSpan.recordException(error)
                queueSpan.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: error.message
                })
                throw error
            } finally {
                queueSpan.end()
            }
        })
    }

    async processSequentially(parentSpan) {
        this.processing = true
        let messageIndex = 0
        var result = null
        while (this.messageQueue.length > 0) {
            const { message } = this.messageQueue.shift()
            const copiedMessage = SysUtils.copyMessage(message)
            this.addTag(copiedMessage)

            result = await this.processMessage(copiedMessage, messageIndex++, parentSpan)
        }
        //  logger.debug(`\n\n\nProcessorImpl.processSequentially copied`)
        //logger.v(result)
        this.processing = false
        return result
    }

    async processMessage(message, index, parentSpan) {
        return await tracer.startActiveSpan('processor.processMessage', {
            parent: parentSpan,
            attributes: {
                'processor.class': this.constructor.name,
                'processor.id': this.id || 'unknown',
                'message.index': index,
                'message.done': message.done || false,
                'message.tags': message.tags || 'none'
            }
        }, async (messageSpan) => {
            try {
                messageSpan.addEvent('message_processing_start')

                await this.spanMethod('preProcess', message, messageSpan)
                await this.spanMethod('doProcess', message, messageSpan)

                message = await this.spanMethod('postProcess', message, messageSpan)

                messageSpan.addEvent('message_processing_complete')
                messageSpan.setStatus({ code: SpanStatusCode.OK })
            } catch (error) {
                messageSpan.recordException(error)
                messageSpan.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: error.message
                })
                throw error
            } finally {
                messageSpan.end()
                return message
            }
        })
    }

    async spanMethod(methodName, message, parentSpan) {
        return await tracer.startActiveSpan(`processor.${methodName}`, {
            parent: parentSpan,
            attributes: {
                'processor.class': this.constructor.name,
                'processor.method': methodName,
                'message.done': message.done || false
            }
        }, async (methodSpan) => {
            const startTime = Date.now()
            var result = null
            try {
                methodSpan.addEvent(`${methodName}_start`)

                if (methodName === 'doProcess') {
                    result = await this.doProcess(message)
                } else {
                    result = await this[methodName](message)
                }

                const duration = Date.now() - startTime
                methodSpan.setAttribute('method.duration_ms', duration)
                methodSpan.addEvent(`${methodName}_complete`)
                methodSpan.setStatus({ code: SpanStatusCode.OK })
                return result
            } catch (error) {
                methodSpan.recordException(error)
                methodSpan.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: error.message
                })
                throw error
            } finally {
                methodSpan.end()
                return result
            }
        })
    }

    async doProcess(message) {
        const processWhenDone = !this.noProcessWhenDone && this.getProperty(ns.trn.processWhenDone, "true")

        if (!message.done || (message.done && processWhenDone)) {
            return await this.process(message)
        } else {
            return this.emit('message', message)
        }
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
}

export default ProcessorImpl