import { readFile } from 'node:fs/promises'
import { access, constants } from 'node:fs'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'


class Accumulate extends Processor {
    constructor(config) {
        super(config)
    }

    /**
      * Does something with the message and emits a 'message' event with the processed message.
      * @param {Object} message - The message object.
      */
    async process(message) {
        logger.debug(`\n\nAccumulate.process, done = ${message.done}`)
        logger.log(`this.config.whiteboard.accumulator = ${this.config.whiteboard.accumulator}`)
        if (message.done) {
            const targetField = super.getProperty(ns.trn.targetField, "accumulate")
            message[targetField] = this.config.whiteboard.accumulator
            return this.emit('message', message)
        }

        const sourceField = super.getProperty(ns.trn.sourceField, "content")
        const sourceValue = JSONUtils.get(message, sourceField)
        const accumulatorType = super.getProperty(ns.trn.accumulatorType, 'string')

        switch (accumulatorType) {
            case 'array':
                if (this.config.whiteboard.accumulator) {
                    this.config.whiteboard.accumulator.push(sourceValue)
                } else {
                    this.config.whiteboard.accumulator = []
                }
                break

            default:
                if (this.config.whiteboard.accumulator) {
                    // TODO check if this is the same as push()
                    logger.debug(`this.config.whiteboard.accumulator =
                        ${this.config.whiteboard.accumulator}
                        sourceValue = ${sourceValue}`)
                    logger.debug(`append string`)
                    this.config.whiteboard.accumulator = this.config.whiteboard.accumulator + sourceValue
                } else {
                    logger.debug(`create string`)
                    this.config.whiteboard.accumulator = ''
                }

        }
        return this.emit('message', message)
    }
}
export default Accumulate