// src/processors/fs/FileFilter.js
/**
 * @class FileFilter
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Filters files based on include/exclude glob patterns.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trm.fileFilter.include`** - Array of glob patterns to include
 * * **`ns.trm.fileFilter.exclude`** - Array of glob patterns to exclude
 *
 * #### __*Input*__
 * * **`message.fileSpec`** - Object containing `fileFilter` with `include` and `exclude` arrays
 * * **`message.filepath`** - Path of the file to test against patterns
 *
 * #### __*Output*__
 * * **`message.match`** - Boolean indicating if file matches filter
 * * **`message`** - Forwarded if file matches include/exclude rules
 *
 * #### __*Behavior*__
 * * Checks if the provided file path matches any of the include patterns and none of the exclude patterns
 * * Emits the message if the file is accepted by the filter
 *
 * #### __*Side Effects*__
 * * None
 *
 * #### __Tests__
 * * **`./trans filefilter`**
 * * **`npm test -- tests/integration/filefilter-test.spec.js`**
 */

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import { minimatch } from 'minimatch';

/**
 * Filters files in a message based on glob patterns.
 */
class FileFilter extends Processor {
    /**
     * Constructs a FileFilter processor.
     * @param {Object} config - Configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Processes a message, filtering files based on include/exclude patterns.
     * Emits the message if it passes the filter.
     * @param {Object} message - The message object.
     * @returns {Promise<void>}
     */
    async process(message) {
        logger.debug(`\n\nFileFilter.process`)
        if (message.done) {
            return this.emit('message', message)
        }

        message.match = this.checkFileSpec(message)

        if (!message.match) {
            return
        }
        // message forwarded
        return this.emit('message', message)
    }

    /**
     * Checks if the file specified in the message matches the include/exclude patterns.
     * @param {Object} message - The message object containing fileSpec and filepath.
     * @returns {boolean} True if the file matches include and not exclude patterns.
     */
    checkFileSpec(message) {
        const fileSpec = message.fileSpec
        /* eg.
         { "fileSpec": {
            "fileFilter": {
              "include": [
                "**\/*.md"
                ],
                "exclude": [
                  "**\/*.log",
                  "**\/node_modules",
                  "**\/test",
                  "**\/docs",
                  "**\/terrapack.md",
                  "**\/repomix.md"
                ]
              }
    } }  
            */
        const filepath = message.filepath
        /* eg.
         { "filepath": "data/input/yes.this.md" }
         */
        // Check if filepath matches any include pattern
        const included = fileSpec.fileFilter.include.some(pattern => minimatch(filepath, pattern));
        // Check if filepath matches any exclude pattern
        const excluded = fileSpec.fileFilter.exclude.some(pattern => minimatch(filepath, pattern));
        return included && !excluded;
    }
}
export default FileFilter