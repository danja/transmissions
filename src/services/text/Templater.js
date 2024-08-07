// src/services/text/Templater.js
/**
 * @class Templater
 * @extends ProcessService
 * @classdesc
 * **a Transmissions Service**
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

import ProcessService from '../base/ProcessService.js'
import nunjucks from 'nunjucks'
import logger from '../../utils/Logger.js'

class Templater extends ProcessService {
    constructor(config) {
        super(config)
    }

    /**
     * Executes the templating process
     * @param {Object} message - The message object containing template and content information
     */
    async execute(message) {
        if (message.templateFilename) {
            // Extract path and filename from templateFilename
            const path = message.templateFilename.substr(0, message.templateFilename.lastIndexOf("/"))
            const filename = message.templateFilename.substr(message.templateFilename.lastIndexOf("/") + 1)

            // Configure Nunjucks with the template path
            nunjucks.configure(path, { autoescape: false })

            // Render the template file
            message.content = nunjucks.render(filename, message.contentBlocks)
        } else {
            // Configure Nunjucks for string templates
            nunjucks.configure({ autoescape: false })

            // Render the template string
            message.content = nunjucks.renderString(message.template, message.contentBlocks)
        }

        this.emit('message', message)
    }
}

export default Templater