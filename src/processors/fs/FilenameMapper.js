import Processor from '../../model/Processor.js'
import path from 'path'
import logger from '../../utils/Logger.js'

// src/processors/fs/FilenameMapper.js
/**
 * @class FilenameMapper
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Maps file extensions based on the specified format.
 * Primarily used to transform file extensions for different output formats.
 *
 * ### Processor Signature
 *
 * #### __*Input*__
 * * **`message.filepath`** - The original file path to be transformed
 * * **`message.format`** - The target format (default: 'html')
 *
 * #### __*Output*__
 * * **`message`** - The message with updated `filepath` property
 *
 * #### __*Behavior*__
 * * Takes an input file path and target format
 * * Replaces the file extension based on the format mapping
 * * Throws an error for unsupported formats
 * * Preserves the original directory and filename base
 *
 * #### __*Supported Formats*__
 * * `html` - Appends `.mm.html`
 * * `svg` - Appends `.mm.svg`
 *
 * @example
 * const mapper = new FilenameMapper({});
 * 
 * // Transform to HTML format
 * await mapper.process({
 *   filepath: '/path/to/file.txt',
 *   format: 'html'  // becomes '/path/to/file.mm.html'
 * });
 * 
 * // Transform to SVG format
 * await mapper.process({
 *   filepath: '/path/to/file.txt',
 *   format: 'svg'   // becomes '/path/to/file.mm.svg'
 * });
 */
class FilenameMapper extends Processor {
    /**
     * Creates a new FilenameMapper instance.
     * @param {Object} config - Processor configuration object
     */
    constructor(config) {
        super(config)
        /** @private */
        this.extensions = {
            html: '.mm.html',
            svg: '.mm.svg'
        }
    }

    /**
     * Processes the message to transform the file extension based on format.
     * @param {Object} message - The message containing file information
     * @param {string} message.filepath - The original file path to transform
     * @param {string} [message.format='html'] - The target format (html or svg)
     * @returns {Promise<boolean>} Resolves when processing is complete
     * @throws {Error} If an unsupported format is specified
     */
    async process(message) {
        const format = message.format || 'html'
        const extension = this.extensions[format]

        if (!extension) {
            throw new Error(`Unknown format: ${format}`)
        }

        const parsedPath = path.parse(message.filepath)
        message.filepath = path.join(
            parsedPath.dir,
            parsedPath.name + extension
        )

        return this.emit('message', message)
    }
}

export default FilenameMapper
