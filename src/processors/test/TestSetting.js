// src/processors/test/TestSetting.js
/**
 * @class TestSettings
 * @extends Processor
 * @classdesc
 * **a Basic Transmissions Processor**
 *
 * Provides a template for creating new processors and demonstrates the use of config settings and template rendering with Nunjucks.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * None specific; inherits from base Processor
 *
 * #### __*Input*__
 * * **`message.common`** (optional) - Value addressed by all instances
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
 * * Applies content from `message.contentBlocks` to the template
 *
 * #### __*Side Effects*__
 * * None (template rendering is in-memory)
 *
 * #### __*ToDo*__
 * Cache templates for efficiency (possibly in utils)
 * Add more test coverage and documentation
 */

import { readFile } from 'node:fs/promises'
import { access, constants } from 'node:fs'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'


class TestSettings extends Processor {
    constructor(config) {
        super(config)
    }

    /**
      * Does something with the message and emits a 'message' event with the processed message.
      * @param {Object} message - The message object.
      */
    async process(message) {

        logger.debug(`\n\nTestSetting.process`)

        // property values pulled from message | config settings | fallback

        message.settingValue = await this.getProperty(ns.trn.theSettingProperty)

        logger.log(`\nmessage.settingValue ${message.settingValue}`)

        // message forwarded
        return this.emit('message', message)
    }
}
export default TestSettings