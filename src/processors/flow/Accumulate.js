// TODO something about src/processors/util/CaptureAll.js

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
        logger.trace(`\n\nAccumulate.process, done = ${message.done}`)

        const label = super.getProperty(ns.trn.label, 'test')
        const type = super.getProperty(ns.trn.accumulatorType, 'string')
        const acc = this.whiteboard.getAccumulator(label, type)



        if (message.done) {
            const targetField = super.getProperty(ns.trn.targetField, "accumulate")
            logger.trace(`targetField = ${targetField}`)
            message[targetField] = acc
            logger.trace(`full acc = ${acc}`)
            return this.emit('message', message)
        }

        const sourceField = super.getProperty(ns.trn.sourceField, "currentItem")
        const sourceValue = JSONUtils.get(message, sourceField)
        this.whiteboard.accumulate(label, sourceValue)
        logger.trace(`partial acc = ${acc}`)
        return this.emit('message', message)
    }
}
export default Accumulate