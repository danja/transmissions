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
           // TODO MOVE!
           var targetDir = this.getPropertyFromMyConfig(ns.trm.targetDir)
           targetDir = path.join(process.cwd(), targetDir)
           logger.debug(`JSONWalker:targetDir =  ${targetDir}`)

           const payload = structuredClone(message.payload)

           logger.log(payload)
           logger.log(typeof payload)
           if (!payload || typeof payload !== 'object') {
               throw new Error('Invalid JSON payload')
           }
           message.payload = {} // TODO option in config

           for (const item of Object.values(payload)) {
               const clonedMessage = structuredClone(message)
               clonedMessage.item = item
               message.item = item  // TODO refactor, grab the last
               this.emit('message', clonedMessage)
           }

           message.done = true
           this.emit('message', message)
       } catch (err) {
           logger.error("JSONWalker.process error: " + err.message)
           throw err
       }
   }
}

export default JSONWalker