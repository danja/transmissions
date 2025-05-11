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
import PathResolver from '../../utils/PathResolver.js'

// TODO cache templates
// in a singleton this.app.cache?

class Templater extends Processor {
    constructor(config) {
        super(config)
    }

    /**
     * Executes the templating process
     * @param {Object} message - The message object containing template and content information
     */
    async process(message) {

        logger.debug(`\n\nTemplater.process`)
        logger.debug(`\nTemplater.process, message.contentBlocks = ${JSON.stringify(message.contentBlocks)}`)


        let filePath = await PathResolver.resolveFilePath({
            message,
            app: this.app,
            getProperty: (prop, def) => this.getProperty(prop, def),
            defaultFilePath: this.defaultFilePath,
            sourceOrDest: ns.trn.templateFilename
        })

        logger.debug(`Templater.process(), using template file: ${filePath}`)

        const dir = path.dirname(filePath); // '/danny/sites/danny.ayers.name/postcraft/layout/base/templates'
        const filename = path.basename(filePath); // 'article-content.njk'

        // TODO sort out fields
        nunjucks.configure(dir, { autoescape: false })

        message.content = await nunjucks.render(filename, message.data)

        //
        logger.debug(`content POST = ${message.content}`)


        // Configure Nunjucks for string templates
        // TODO priorities
        //      message.content = nunjucks.renderString(message.template, message.contentBlocks)

        //  nunjucks.configure({ autoescape: false })

        return this.emit('message', message)
    }
}
export default Templater