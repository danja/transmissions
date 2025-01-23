// src/processors/example-group/TestSettings.js
/**
 * @class TestSettings
 * @extends Processor
 * @classdesc
 * **a Basic Transmissions Processor**
 *
 * Provides a template for creating new processors, demonstrates use of config settings.
 *
 * #### __*Input*__
 * * **`message.common`** - addressed by all instances of this TestSettings (optional, default undefined)
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
  * #### __*ToDo*__
 * * Add test information here
 * * Cache templates - cache in utils?
 */

import { readFile } from 'node:fs/promises'
import { access, constants } from 'node:fs'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../base/Processor.js'


class TestSettings extends Processor {
    constructor(config) {
        super(config)
    }

    /**
      * Does something with the message and emits a 'message' event with the processed message.
      * @param {Object} message - The message object.
      */
    async process(message) {
        //   logger.setLogLevel('debug')
        logger.debug(`\n\nTestSettings.process`)

        // property values pulled from message | config settings | fallback

        const me = this.getProperty(ns.trn.me, 'default me')
        logger.log(`\nI am ${me}`)

        switch (me) {
            case ':settingsUseMessage':
                message.test = 'this came from message'
                logger.log(`${this.getProperty(ns.trn.test)}`)
                break

            case ':settingsSingle':
                logger.log(`${this.getProperty(ns.trn.name)}`)
                break

            case ':settingsURI':
                logger.log(`${this.getProperty(ns.trn.uri)}`)
                break

            case ':settingsPath':
                // need to check ontology for this
                // TODO needs something like :path a :Path .
                logger.log(`${this.getProperty(ns.trn.path)}`)
                break

            case ':settingsMulti':
                logger.log(`${this.getProperty(ns.trn.name)}`)
                logger.log(`${this.getProperty(ns.trn.uri)}`)
                break

            // TODO where did I use this?
            case ':settingsKeyValue':
                logger.log(`${this.getProperty(ns.trn.name)}`)
                break

            case ':settingsLists':
                logger.log(`aSetting : \n${this.getProperty(ns.trn.aSetting)}`)
                logger.log(`bSetting : \n${this.getProperty(ns.trn.bSetting)}`)
                break

            default:
                logger.log(`This is fallback : ${this.getProperty(ns.trn.name, 'yes it is')}`)
                break
        }

        // message forwarded
        return this.emit('message', message)
    }
}
export default TestSettings