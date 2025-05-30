// src/processors/flow/Accumulate.js
/**
 * @class Accumulate
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Accumulates values from messages as they pass through the pipeline, using a whiteboard accumulator.
 * Emits the accumulated result when a message with `done=true` is received.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.label`** (optional) - Label for the accumulator (default: 'test')
 * * **`ns.trn.accumulatorType`** (optional) - Type of accumulator (default: 'string')
 * * **`ns.trn.targetField`** (optional) - Field to store the accumulated result (default: 'accumulate')
 * * **`ns.trn.sourceField`** (optional) - Field to read the value to accumulate (default: 'currentItem')
 *
 * #### __*Input*__
 * * **`message`** - Message with the value to accumulate
 *
 * #### __*Output*__
 * * **`message`** - Message with the accumulated result attached when `done=true`
 *
 * #### __*Behavior*__
 * * Retrieves or creates an accumulator on the whiteboard
 * * Adds value from `sourceField` to the accumulator for each message
 * * Emits the accumulated result in `targetField` when `done=true`
 *
 * #### __*Side Effects*__
 * * Mutates the whiteboard accumulator
 *
 * #### __Tests__
 * * **`./run accumulate-test`**
 * * **`npm test -- tests/integration/accumulate-test.spec.js`**
 */
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'

class Accumulate extends Processor {
    /**
     * Constructs an Accumulate processor.
     * @param {object} config - Processor configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Accumulates values from messages and emits the result when done.
     * @param {object} message - The message being processed.
     * @returns {Promise<void>}
     */
    async process(message) {
        logger.trace(`\n\nAccumulate.process, done = ${message.done}`)

        const label = super.getProperty(ns.trn.label, 'test')
        const type = super.getProperty(ns.trn.accumulatorType, 'string')
        const acc = this.whiteboard.getAccumulator(label, type)

        // should use ns.trn.processWhenDone somehow?

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