// src/processors/text/Templater.js

import Processor from '../../model/Processor.js'
import nunjucks from 'nunjucks'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import PathResolver from '../../utils/PathResolver.js'

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
class Templater extends Processor {
    /**
     * Constructs a Templater processor.
     * @param {Object} config - Configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Executes the templating process.
     * Resolves the template file path, configures Nunjucks, and renders the template
     * using the data field specified in `ns.trn.dataField` (default: 'contentBlocks').
     * Emits the message with rendered content.
     * @param {Object} message - The message object containing template and content information.
     * @returns {Promise<void>}
     */
    async process(message) {

        logger.debug(`\n\nTemplater.process`)

        // Determine which field on the message contains the template data (default: 'contentBlocks')
        var dataField = this.getProperty(ns.trn.dataField, 'contentBlocks')
        logger.debug(`    dataField = ${dataField}`)

        // Resolve the template file path using PathResolver utility
        let filePath = await PathResolver.resolveFilePath({
            message,
            app: this.app,
            getProperty: (prop, def) => this.getProperty(prop, def),
            defaultFilePath: this.defaultFilePath,
            sourceOrDest: ns.trn.templateFilename
        })

        logger.debug(`    using template file: ${filePath}`)

        const dir = path.dirname(filePath);
        const filename = path.basename(filePath);

        // Configure Nunjucks to use the template directory
        nunjucks.configure(dir, { autoescape: false })

        // Render the template file with the chosen data field
        message.content =
            await nunjucks.render(filename, message[dataField])

        logger.debug(`content POST = ${message.content}`)

        // Alternative: render from a template string if needed
        // message.content = nunjucks.renderString(message.template, message.contentBlocks)

        return this.emit('message', message)
    }
}
export default Templater