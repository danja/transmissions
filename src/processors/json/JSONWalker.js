// src/processors/json/JSONWalker.js
/**
* @class JSONWalker
* @extends ProcessProcessor
* @classdesc
* **A Transmissions Processor**
*
* Walks through a JSON structure and emits messages for each item.
*
* ### Processor Signature
*
* #### ***Configuration***
* ***`ns.trm.targetDir`** - Target directory path relative to current working directory
*
* #### ***Input***
* ***`message.payload`** - JSON object to process
*
* #### ***Output***
* * Emits a message for each item in the input payload
* * Final message has `done: true` flag
* * Each emitted message contains:
*   * ***`message.item`** - Current item being processed
*   * ***`message.payload`** - Empty object (configurable)
*
* #### ***Behavior***
* * Validates input is a JSON object
* * Creates separate message for each value in payload
* * Clones messages to prevent cross-contamination
* * Signals completion with done flag
*/

import path from 'path'
import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'
import ns from '../../utils/ns.js'

class JSONWalker extends ProcessProcessor {
    constructor(config) {
        super(config)
    }

    /**
     * Processes JSON payload by walking its structure and emitting messages
     * @param {Object} message - Contains payload to process
     * @throws {Error} If payload is invalid
     * @emits message - For each item and completion
     */
    async process(message) {
        try {
            var pointer = this.getPropertyFromMyConfig(ns.trm.pointer)

            logger.debug(`JSONWalker pointer =  ${pointer}`)

            const content = structuredClone(message.content)
            message.content = {} // TODO option in config

            //  for (const item of Object.values(content)) {
            for (var i = 0; i < content.length; i++) {
                const newMessage = structuredClone(message)
                newMessage.content = content[i]
                //    newMessage.content.items = []
                //  newMessage.content.items.push[item]
                //   message.item = item  // TODO refactor, it's just to grab the last
                //    finalMessage = newMessage
                this.emit('message', newMessage)
            }

            var finalMessage = structuredClone(message)
            finalMessage.content = content[content.length - 1]
            //  finalMessage.content = {}


            /* this is for values - dict
            for (const item of Object.values(content)) {
                const newMessage = structuredClone(message)
                newMessage.content = {}
                newMessage.content.items = []
                newMessage.content.items.push[item]
                //   message.item = item  // TODO refactor, it's just to grab the last
                finalMessage = newMessage
                this.emit('message', newMessage)
            }
                */

            finalMessage.done = true
            this.emit('message', finalMessage)
        } catch (err) {
            logger.error("JSONWalker.process error: " + err.message)
            throw err
        }
    }
}

export default JSONWalker