/**
 * @module processors/text/StringFilter
 */
import path from 'path'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'
import StringUtils from '../../utils/StringUtils.js'

/**
 * @class StringFilter
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Filters files based on include/exclude patterns in file paths.
 *
 * ### Service Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.includePattern`** - (Optional) Pattern(s) to include files
 * * **`ns.trn.excludePattern`** - (Optional) Pattern(s) to exclude files
 *
 * #### __*Input*__
 * * **`message.filepath`** - The path of the file to be filtered
 *
 * #### __*Output*__
 * * **`message`** - Unmodified input message (if file passes the filter)
 * * **`undefined`** - If file is filtered out or if no filepath is provided
 *
 * #### __*Behavior*__
 * * Processes each file path against include/exclude patterns
 * * If no patterns are specified, all files pass through
 * * Exclude patterns take precedence over include patterns
 * * Uses StringUtils.matchPatterns for pattern matching
 *
 * #### __*Side Effects*__
 * * None
 *
 * #### __*Dependencies*__
 * * StringUtils - For pattern matching functionality
 *
 * @example
 * // Example configuration
 * const config = {
 *   [ns.trn.includePattern]: ['*.txt', 'docs/**'],
 *   [ns.trn.excludePattern]: ['**\/temp\/*', '*.log']
 * };
 * const filter = new StringFilter(config);
 */
class StringFilter extends Processor {
    /**
     * Creates a new StringFilter instance
     * @param {Object} config - Configuration object
     * @param {Array<string>} [config[ns.trn.includePattern]] - Patterns for files to include
     * @param {Array<string>} [config[ns.trn.excludePattern]] - Patterns for files to exclude
     */
    constructor(config) {
        super(config)
    }

    // filepath maybe a good default, but..?
    /**
     * Processes a message containing a file path and filters it based on patterns
     * @param {Object} message - The message object containing file information
     * @param {string} [message.filepath] - Path of the file to be filtered
     * @param {boolean} [message.done] - If true, passes the message through
     * @returns {Promise<undefined>} Resolves when processing is complete
     * @emits message When the file passes the filter conditions
     */
    async process(message) {
        if (message.done) {
            return this.emit('message', message)
        }

        if (!message.filepath) {
            logger.warn('StringFilter: No filepath provided')
            return
        }
        this.includePatterns = this.getValues(ns.trn.includePattern)
        this.excludePatterns = this.getValues(ns.trn.excludePattern)

        if (this.isAccepted(message.filepath)) {
            return this.emit('message', message)
        }
    }

    //matchPattern(filePath, pattern) {
    //  try {
    //    const regexPattern = pattern
    //      .replace(/\./g, '\\.')
    //    .replace(/\*/g, '.*')
    //  .replace(/\?/g, '.');
    //        const regex = new RegExp(`^${regexPattern}$`);
    //      const filename = path.basename(filePath);
    //    return regex.test(filename);
    //} catch (error) {
    //  logger.error('Pattern matching error:', { pattern, error });
    //return false;
    //  }
    // }

    /**
     * Determines if a file path should be accepted based on include/exclude patterns
     * @private
     * @param {string} filePath - The file path to check
     * @returns {boolean} True if the file should be accepted, false otherwise
     * 
     * @description
     * The filtering logic follows these rules:
     * 1. If no patterns are specified, accept all files
     * 2. If the file matches any exclude pattern, reject it
     * 3. If include patterns exist and the file matches any, accept it
     * 4. If include patterns exist but file matches none, reject it
     * 5. Otherwise, accept the file
     */
    isAccepted(filePath) {
        if (!filePath) return false

        if (this.excludePatterns.length === 0 && this.includePatterns.length === 0) {
            return true
        }

        if (StringUtils.matchPatterns(filePath, this.excludePatterns)) {
            return false
        }

        if (StringUtils.matchPatterns(filePath, this.includePatterns)) {
            return true
        }

        // If there are include patterns but none matched, reject the file
        if (this.includePatterns.length > 0) {
            return false
        }

        return true
    }
}

export default StringFilter