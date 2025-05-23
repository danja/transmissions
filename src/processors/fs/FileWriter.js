import path from 'path'
import { access, constants, writeFileSync } from 'node:fs'
import ns from '../../utils/ns.js'
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { mkdir, mkdirSync } from 'node:fs'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'
import PathResolver from '../../utils/PathResolver.js'

// src/processors/fs/FileWriter.js
/**
 * @class FileWriter
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Writes data to files on the local filesystem with automatic directory creation.
 * Supports writing both string and JSON content to files.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.destinationFile`** - The target file path (relative to `applicationRootDir` or absolute)
 * * **`ns.trn.contentField`** - Field in the message containing the content to write (default: 'content')
 *
 * #### __*Input*__
 * * **`message`** - The message object
 * * **`message.filepath`** - Alternative to `ns.trn.destinationFile`
 * * **`message.content`** - The content to write (if not using `ns.trn.contentField`)
 * * **`message.dump`** - If true, saves the entire message as JSON
 * * **`message.workingDir`** - Working directory for dump files
 *
 * #### __*Output*__
 * * **`message`** - The input message, unmodified
 *
 * #### __*Behavior*__
 * * Automatically creates parent directories if they don't exist
 * * Converts non-string content to JSON when needed
 * * Handles both direct content writing and full message dumps
 * * Uses `PathResolver` for flexible file path resolution
 * * Logs detailed debug information about write operations
 *
 * #### __*Side Effects*__
 * * Creates directories and files on the filesystem
 * * Overwrites existing files without warning
 *
 * @example
 * // Basic usage with content field
 * const writer = new FileWriter({});
 * await writer.process({
 *   content: 'Hello, world!',
 *   filepath: '/path/to/output.txt'
 * });
 *
 * // Using configuration for content field
 * const configuredWriter = new FileWriter({
 *   [ns.trn.contentField]: 'data.payload',
 *   [ns.trn.destinationFile]: 'output/data.json'
 * });
 */
class FileWriter extends Processor {

    /**
     * Creates a new FileWriter processor instance.
     * @param {Object} config - Processor configuration object
     */
    constructor(config) {
        super(config)
        /** @private */
        this.defaultFilePath = 'output/output.md' // Default output path if none specified
    }

    /**
     * Processes the message and writes content to a file.
     * @param {Object} message - The message containing content and file information
     * @returns {Promise<boolean>} Resolves to true when the write operation is complete
     */
    async process(message) {
        logger.trace(`\n\nFileWriter.process, message.done = ${message.done}`)
        logger.trace(`FileWriter.process, count = ${message.eachCount}`)
        if (message.done) {
            logger.trace(`\n\nFileWriter.process, message.done = ${message.done} SKIPPING!!`)
            // return Promise.resolve(this.emit('message', message))
            return this.emit('message', message)
        }

        if (message.dump) {
            // TODO make optional (on done?) - is a pain for multi
            //    const filename = `message_${new Date().toISOString()}.json`
            const filename = 'message.json'
            const f = path.join(message.workingDir, filename)
            const content = JSON.stringify(message)
            // Check if the file is readable.
            access(f, constants.W_OK, (err) => {
                if (err) {
                    logger.error(`FileWriter error : ${f} is not writable.`)
                    logger.reveal(message)
                }
            })
            await this.doWrite(f, content, message)
            return true
        }


        // Use PathResolver for file path resolution
        const filePath = await PathResolver.resolveFilePath({
            message,
            app: this.app,
            getProperty: (prop, def) => this.getProperty(prop, def),
            defaultFilePath: this.defaultFilePath,
            sourceOrDest: ns.trn.destinationFile,
            isWriter: true
        })

        logger.trace(`Filewriter, filepath = ${filePath}`)
        const dirName = dirname(filePath)
        logger.trace("Filewriter, dirName = " + dirName)

        const contentPath = super.getProperty(ns.trn.contentField, 'content')
        logger.trace(`Filewriter, contentPath = ${contentPath}`)
        const content = JSONUtils.get(message, contentPath)
        logger.trace(`Filewriter, content = ${content}`)

        this.mkdirs(dirName)
        await this.doWrite(filePath, content, message)
        return true
    }

    /**
     * Internal method to perform the actual file write operation.
     * @param {string} filePath - The path to write the file to
     * @param {*} content - The content to write (will be stringified if not a string)
     * @param {Object} message - The original message (for logging)
     * @private
     */
    async doWrite(filePath, content, message) {
        logger.trace(`FileWriter.doWrite, file = ${filePath}`)
        logger.trace(`typeof content = ${typeof content}`)
        if (typeof content !== 'string') {
            content = JSON.stringify(content, null, 2) // Pretty print JSON
        }
        logger.log(` - FileWriter writing: ${filePath}`)

        /*
        if (filePath.includes(`[object Object]`)) {
            logger.reveal(message)
        }
        */

        logger.trace(`content = ${content}`)
        // maybe stat first, check validity - the intended target dir was blocked by a file of the same name
        await writeFile(filePath, content)
        logger.trace(` - FileWriter written: ${filePath}`)
    }

    /**
     * Creates directories recursively if they don't exist.
     * @param {string} dir - The directory path to create
     * @private
     */
    mkdirs(dir) {
        logger.trace(`FileWriter.mkdirs, dir = ${dir}`)
        try {
            mkdirSync(dir, { recursive: true })
        }
        catch (e) {
            logger.warn(`Warn: FileWriter.mkdirs, maybe dir exists : ${dir} ?`)
        }
    }
}

export default FileWriter
