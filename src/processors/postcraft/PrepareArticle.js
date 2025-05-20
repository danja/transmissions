// src/processors/postcraft/PrepareArticle.js

// NOT USED
/**
 * @class PrepareArticle
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Provides a template for creating new processors and demonstrates use of config settings and message templating.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * None specific (template settings may be added as needed)
 *
 * #### __*Input*__
 * * **`message.common`** - Shared value for all PrepareArticle instances (optional)
 * * **`message.something1`** - Template string (used if templateFilename is not provided)
 * * **`message.something2`** - Object with properties for template rendering (e.g., title, body)
 * * **`message.notavalue`** - Object with properties for template rendering
 *
 * #### __*Output*__
 * * **`message.content`** - The rendered template content
 *
 * #### __*Behavior*__
 * * Demonstrates template rendering from message fields
 * * Shows how to use config settings in a processor
 * * Intended as a starting point for new processors
 *
 * #### __*Side Effects*__
 * * None (message is transformed, not mutated in place)
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Implement actual processing logic
 * * Add tests for template scenarios
 */

import { readFile } from 'node:fs/promises'
import { access, constants } from 'node:fs'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'


class PrepareArticle extends Processor {
    constructor(config) {
        super(config)
    }

    /**
      * Does something with the message and emits a 'message' event with the processed message.
      * @param {Object} message - The message object.
      */
    async process(message) {
        logger.debug(`\n\nExampleProcessor.process`)

        // TODO figure this out better
        // may be needed if preceded by a spawning processor, eg. fs/DirWalker
        if (message.done) {
            return this.emit('message', message)
            // or simply return
        }

        //        const me = await this.getProperty(ns.trn.me)

        // message forwarded
        return this.emit('message', message)
    }
}
export default PrepareArticle