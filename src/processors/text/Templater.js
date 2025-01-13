// src/processors/text/Templater.js
/**
 * @class Templater
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Provides templating functionality using Nunjucks.
 *
 * #### __*Input*__
 * * **`message.templateFilename`** - Path to the template file (optional)
 * * **`message.template`** - Template string (used if templateFilename is not provided)
 * * **`message.contentBlocks`** - Object with properties for template rendering (e.g., title, body)
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
 * * TODO: Add test information
 */

import Processor from '../base/Processor.js'
import nunjucks from 'nunjucks'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

class Templater extends Processor {
    constructor(config) {
        super(config)
    }

    /**
     * Executes the templating process
     * @param {Object} message - The message object containing template and content information
     */
    async process(message) {
        logger.setLogLevel('debug')
        //   logger.log(this.getPropertyFromMyConfig(ns.trn.templateFilename))
        //    this.addPropertyToMyConfig(ns.trn.templateFilename, 'poo')
        //   this.showMyConfig()
        var templateFilename = this.getProperty(ns.trn.templateFilename)

        logger.debug(`\nTemplater.process, templateFilename = ${templateFilename}`)
        // process.exit()

        if (templateFilename) {
            //       logger.debug(`\nTemplater.process, templateFilename = ${templateFilename}`)

            // Extract path and filename from templateFilename
            var targetPath = templateFilename.substr(0, templateFilename.lastIndexOf("/"))
            const filename = templateFilename.substr(templateFilename.lastIndexOf("/") + 1)

            if (!path.isAbsolute(targetPath)) {
                targetPath = path.join(this.getProperty(ns.trn.targetPath, message.rootDir), targetPath)
            }

            logger.debug('\nTemplater, targetPath = ' + targetPath)
            logger.debug('Templater, filename = ' + filename)

            // Configure Nunjucks with the template path
            nunjucks.configure(targetPath, { autoescape: false })

            //   logger.debug(`content PRE = ${message.content}`)
            // Render the template file
            message.content = nunjucks.render(filename, message.contentBlocks)

            logger.debug(`content POST = ${message.content}`)


        } else {   // Configure Nunjucks for string templates
            // TODO priorities

            nunjucks.configure({ autoescape: false })

            //    logger.reveal(message)
            // Render the template string
            message.content = nunjucks.renderString(message.template, message.contentBlocks)
        }

        return this.emit('message', message)
    }
}
export default Templater