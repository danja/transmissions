import Processor from '../../model/Processor.js'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import path from 'path'

// src/processors/terrapack/FileContainer.js
/**
 * @class FileContainer
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Aggregates and summarizes files processed during a transmission run, storing their metadata and content in a container object. Emits a summary file when processing is complete.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.destination`** - The target path for the output file or summary
 *
 * #### __*Input*__
 * * **`message.filepath`** - Path to the file being processed
 * * **`message.content`** - Content of the file being processed
 * * **`message.done`** (boolean) - Signals completion and triggers summary output
 * * **`message.targetPath`** (optional) - Base directory for relative path calculation
 * * **`message.rootDir`** (optional) - Fallback base directory
 *
 * #### __*Output*__
 * * **`message`** - Emits a summary file with a JSON representation of all processed files and types when `done` is true; otherwise, processes and stores file metadata
 *
 * #### __*Behavior*__
 * * Collects file metadata and content into an internal container
 * * When `message.done` is true, emits a summary file with all collected data
 * * Computes relative paths for files based on provided directories
 * * Logs warnings if critical information is missing
 *
 * #### __*Side Effects*__
 * * None (all changes are in-memory or in emitted message)
 *
 * #### __*ToDo*__
 * Improve error handling and edge case coverage
 * Add support for additional file metadata and validation
 */
class FileContainer extends Processor {
    constructor(config) {
        super(config)
        this.container = {
            files: {},
            summary: {
                totalFiles: 0,
                fileTypes: {},
                timestamp: new Date().toISOString()
            }
        }
    }

    async process(message) {

        message.filepath = this.getProperty(ns.trn.destination)
        if (message.done) {

            // TODO FIX ME
            message.filepath = message.filepath + '_done.txt'

            message.content = JSON.stringify(this.container, null, 2)

            return this.emit('message', message)
        }

        if (!message.filepath || !message.content) {
            logger.warn('FileContainer: Missing filepath or content')
            // this.emit('message', message);
            return
        }

        // Store relative path from target directory
        const targetDir = message.targetPath || message.rootDir
        const relativePath = path.relative(targetDir, message.filepath)

        // Add file to container
        this.container.files[relativePath] = {
            content: message.content,
            type: path.extname(message.filepath),
            timestamp: new Date().toISOString()
        }

        // Update summary
        this.container.summary.totalFiles++
        const fileType = path.extname(message.filepath) || 'unknown'
        this.container.summary.fileTypes[fileType] = (this.container.summary.fileTypes[fileType] || 0) + 1

        return this.emit('message', message)
    }
}

export default FileContainer