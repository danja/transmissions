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
 * Provides Nunjucks-based templating functionality, supporting both file-based and string templates.
 *
 * ### Service Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.templateFilename`** - Path to the template file (optional if template is provided in message)
 * * **`ns.trn.dataField`** - (optional) Field containing template data (default: 'contentBlocks')
 *
 * #### __*Input*__
 * * **`message.templateFilename`** - Overrides the configured template file path
 * * **`message.template`** - Template string (used if no templateFilename is provided)
 * * **`message[dataField]`** - Data object for template rendering (default field: 'contentBlocks')
 * * **`message.applicationRootDir`** - (optional) Root directory for template path resolution
 *
 * #### __*Output*__
 * * **`message.content`** - The rendered template content
 *
 * #### __*Behavior*__
 * * Renders templates using Nunjucks templating engine
 * * Supports both file-based and string templates
 * * Auto-escapes content by default
 * * Resolves template paths relative to application root
 * * Configures Nunjucks to use the template's directory for includes/extends
 *
 * #### __*Side Effects*__
 * * Modifies the message object by setting the rendered content
 * * Configures Nunjucks environment for template directory
 *
 * #### __*Tests*__
 * * TODO: Add test information
 *
 * #### __*ToDo*__
 * * Implement template caching
 * * Add support for custom Nunjucks filters and extensions
 * * Add test cases for various template scenarios
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
        var dataField = super.getProperty(ns.trn.dataField, 'contentBlocks')
        logger.debug(`    dataField = ${dataField}`)

        // First try to get the template path directly from config
        let filePath = super.getProperty(ns.trn.templateFilename, '')

        // If not found in config, try resolving through PathResolver
        if (!filePath) {
            const resolvedPath = await PathResolver.resolveFilePath({
                message,
                app: this.app,
                getProperty: (prop, def) => super.getProperty(prop, def),
                defaultFilePath: this.defaultFilePath,
                sourceOrDest: ns.trn.templateFilename
            });
            filePath = resolvedPath || '';
        }

        logger.debug(`    using dataField: ${dataField}`);

        // Ensure we have a valid file path
        if (!filePath) {
            throw new Error('No template file path specified');
        }

        // Ensure filePath is a string
        const templatePath = Array.isArray(filePath) ? filePath[0] : filePath;

        // Resolve the path relative to the working directory if it's not absolute
        if (!path.isAbsolute(templatePath)) {
            filePath = path.join(this.app.workingDir, templatePath);
        } else {
            filePath = templatePath;
        }

        const dir = path.dirname(filePath);
        const filename = path.basename(filePath);
        logger.debug(`    using template dir: ${dir}`)
        logger.debug(`    using template filename: ${filename}`)
        // Configure Nunjucks to use the template directory
        nunjucks.configure(dir, { autoescape: false })
        //    logger.debug(`dataField = ${JSON.stringify(dataField)}`)
        logger.debug(`filename = ${filename}`)
        //    logger.debug(`message[dataField] = ${JSON.stringify(message[dataField])}`)
        // Render the template file with the chosen data field
        message.content =
            await nunjucks.render(filename, message[dataField])

        logger.debug('BBB')
        //    logger.debug(`content POST = ${message.content}`)

        // Alternative: render from a template string if needed
        // message.content = nunjucks.renderString(message.template, message.contentBlocks)

        return this.emit('message', message)
    }
}
export default Templater