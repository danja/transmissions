// src/processors/example-group/ExampleProcessor.js
/**
 * @class ExampleProcessor
 * @extends Processor
 * @classdesc
 * **a Basic Transmissions Processor**
 *
 * Provides a template for creating new processors, demonstrates use of config settings.
 *
 * #### __*Input*__
 * * **`message.common`** - addressed by all instances of this ExampleProcessor (optional, default undefined)
 * * **`message.something1`** - Template string (used if templateFilename is not provided)
 * * **`message.something2`** - Object with properties for template rendering (e.g., title, body)
 * * **`message.notavalue`** - Object with properties for template rendering (e.g., title, body)
 *
 * #### __*Output*__
 * * **`message.content`** - The rendered template content
 *
 * #### __*Behavior*__
 * * Uses Nunjucks to render templates
 * * Can render from a template file or a template string
 * * Applies content from message.contentBlocks to the template
 *
 * #### __Tests__
 * *
 *
  * #### __TODO__
 * * Add test information here
 * * Cache templates - cache in utils?
 */

import { readFile } from 'node:fs/promises';
import { access, constants } from 'node:fs';
import path from 'path';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';
import Processor from '../base/Processor.js';


class ExampleProcessor extends Processor {
    constructor(config) {
        super(config);
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

        // message is processed here :

        // property values pulled from message | config settings | fallback
        const me = this.getProperty(ns.trn.me)
        logger.log(`\nI am ${me}`)

        message.common = this.getProperty(ns.trn.common)
        message.something1 = this.getProperty(ns.trn.something1)

        message.something2 = this.getProperty(ns.trn.something2)

        var added = this.getProperty(ns.trn.added, '')
        message.something1 = message.something1 + added

        message.notavalue = this.getProperty(ns.trn.notavalue, 'fallback value')

        // message forwarded
        return this.emit('message', message);
    }
}
export default ExampleProcessor;