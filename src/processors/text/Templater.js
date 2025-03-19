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
 * *
 *
  * #### __TODO__
 * * Add test information here
 * * Cache templates - cache in utils?
 */

import Processor from '../../model/Processor.js'
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

        logger.trace(`\n\nTemplater.process`)
        logger.trace(`\nTemplater.process, message.contentBlocks = ${JSON.stringify(message.contentBlocks)}`)
        var templateFilename = await this.getProperty(ns.trn.templateFilename)

        if (templateFilename) {
            //       logger.trace(`\nTemplater.process, templateFilename = ${templateFilename}`)

            // TODO tidy this up (move out?)
            // Extract path and filename from templateFilename
            var templatePath = templateFilename.substr(0, templateFilename.lastIndexOf("/"))
            const filename = templateFilename.substr(templateFilename.lastIndexOf("/") + 1)

            if (!path.isAbsolute(templatePath)) { // needed?
                super.getProperty(ns.trn.targetPath)
                templatePath = path.join(super.getProperty(ns.trn.targetPath), templatePath) + path.sep
            }

            logger.trace('\nTemplater, templatePath = ' + templatePath)
            logger.trace('Templater, filename = ' + filename)
            logger.trace(`\nTemplater.process, templateFilename = ${templateFilename}`)

            // Configure Nunjucks with the template path
            nunjucks.configure(templatePath, { autoescape: false })

            //   logger.trace(`content PRE = ${message.content}`)
            // Render the template file
            try {
                // message.content = nunjucks.render(templateFilename, message.contentBlocks)
                message.content = nunjucks.render(filename, message.contentBlocks)
            } catch (err) {
                logger.error(`\nTemplater.process, error rendering template: ${err}`)
                logger.error(`templatePath = ${templatePath}`)
                logger.error(`templateFilename = ${templateFilename}`)
                return
            }
            //
            logger.trace(`content POST = ${message.content}`)


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