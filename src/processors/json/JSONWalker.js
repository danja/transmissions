// src/processors/json/JSONWalker.js
/**
* @class JSONWalker
* @extends Processor
* @classdesc
* **A Transmissions Processor**
*
* Walks through a JSON structure and emits messages for each item.
*
* ### Processor Signature
*
* #### ***Configuration***
* ***`ns.trn.targetDir`** - Target directory path relative to current working directory
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
import Processor from '../base/Processor.js'
import ns from '../../utils/ns.js'

class JSONWalker extends Processor {
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

        message.done = false
        var pointer = this.getProperty(ns.trn.pointer)

        logger.debug(`JSONWalker pointer =  ${pointer}`)

        //   process.exit(1)
        var content = structuredClone(message.content)
        if (typeof content === 'string') {
            logger.debug(`content is a string, parsing to JSON`)
            content = JSON.parse(content)
        }
        message.content = {} // TODO option in config
        logger.debug(`content.length  = ${content.length}`)
        var die = this.getProperty(ns.trn.die)
        logger.debug(`die = ${die}`)
        if (die == "true") {
            //    logger.debug(`content.slice(0, 10) = ${content.slice(0, 10)}`)
            //  logger.reveal(content.slice(0, 10))
            process.exit(1)
        }
        //  for (const item of Object.values(content)) {
        for (var i = 0; i < content.length; i++) {
            const newMessage = structuredClone(message)
            newMessage.content = content[i]
            this.emit('message', newMessage)
        }

        var finalMessage = structuredClone(message)
        finalMessage.content = content[content.length - 1]

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

    }
}

export default JSONWalker