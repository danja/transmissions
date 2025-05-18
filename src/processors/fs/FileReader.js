// src/processors/fs/FileReader.js
/**
 * @class FileReader
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Reads the contents of a file from the local filesystem and attaches it to the message.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.sourceFile`** - Path to the source file (relative to application root, or absolute)
 * * **`ns.trn.metaField`** (optional) - Message field to store file metadata
 * * **`ns.trn.mediaType`** (optional) - MIME type to interpret file content (e.g., `application/json`)
 * * **`ns.trn.targetField`** (optional) - Message field to store file content (default: `content`)
 *
 * #### __*Input*__
 * * **`message`** - Message containing any fields required for file path resolution
 *
 * #### __*Output*__
 * * **`message`** - Message with file content and optionally file metadata attached
 *
 * #### __*Behavior*__
 * * Resolves the file path using `PathResolver`
 * * Verifies that the file is readable
 * * Optionally attaches file metadata to the message
 * * Reads the file content and attaches it to the message, parsing as JSON if specified
 * * Emits the updated message
 *
 * #### __*Side Effects*__
 * * Reads from the filesystem
 *
 * #### __Tests__
 * * **`./run file-reader-test`**
 * * **`npm test -- tests/integration/file-reader-test.spec.js`**
 */
import { readFile } from 'node:fs/promises'
import { access, constants, statSync } from 'node:fs'
import path from 'path'
import mime from 'node-mime-types'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import PathResolver from '../../utils/PathResolver.js'

class FileReader extends Processor {
    /**
     * Constructs a FileReader processor.
     * @param {object} config - Processor configuration object.
     */
    constructor(config) {
        super(config)
        /**
         * @type {string}
         * Default file path used if none is provided in the message or config.
         */
        this.defaultFilePath = 'input/input.md'
    }

    /**
     * Reads a file and attaches its content (and optionally metadata) to the message.
     * @param {object} message - The message being processed.
     * @returns {Promise<void>}
     */
    async process(message) {
        logger.trace(`FileReader.process, done=${message.done}`)

        if (message.done) return

        // Use PathResolver for file path resolution
        let filePath = await PathResolver.resolveFilePath({
            message,
            app: this.app,
            getProperty: (prop, def) => this.getProperty(prop, def),
            defaultFilePath: this.defaultFilePath,
            sourceOrDest: ns.trn.sourceFile
        })

        logger.trace(`FileReader.process(), reading file: ${filePath}`)
        logger.trace(`FileReader.process(), process.cwd() = ${process.cwd()}`)

        // Verify file is readable
        await new Promise((resolve, reject) => {
            access(filePath, constants.R_OK, (err) => {
                if (err) {
                    reject(new Error(`File ${filePath} is not readable: ${err.message}`))
                } else {
                    resolve(undefined) // Explicitly resolve with undefined
                }
            })
        })

        // Handle metadata if requested
        const metaField = await super.getProperty(ns.trn.metaField, null)
        if (metaField) {
            const metadata = this.getFileMetadata(filePath)
            if (typeof metaField === 'string') {
                message[metaField] = metadata
            } else {
                logger.warn(`metaField is not a string, skipping metadata assignment.`)
            }
        }

        // Read and return file content
        const content = await readFile(filePath, 'utf8')
        logger.debug(` - FileReader read: ${filePath}`)

        message.filePath = filePath

        const mediaType = super.getProperty(ns.trn.mediaType, null)
        logger.trace(`mediaType = ${mediaType}`)
        const targetField = super.getProperty(ns.trn.targetField, `content`)
        if (typeof targetField === 'string') {
            if (mediaType === 'application/json') {
                message[targetField] = JSON.parse(content)
            } else {
                message[targetField] = content
            }
        } else {
            logger.warn(`targetField is not a string, skipping content assignment.`)
        }
        return this.emit('message', message)
    }

    /**
     * Retrieves metadata for a given file path.
     * @param {string} filePath - The path to the file.
     * @returns {object|null} File metadata, or null if retrieval fails.
     */
    getFileMetadata(filePath) {
        try {
            const stats = statSync(filePath)
            const filename = path.basename(filePath)
            return {
                filename: filename,
                mediaType: mime.getMIMEType(filename),
                filepath: filePath,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                accessed: stats.atime,
                isDirectory: stats.isDirectory(),
                isFile: stats.isFile(),
                permissions: stats.mode,
                owner: stats.uid,
                group: stats.gid
            }
        } catch (error) {
            if (error instanceof Error) {
                logger.error(`Error getting file metadata: ${error.message}`)
            } else {
                logger.error(`Unknown error getting file metadata.`)
            }
            return null
        }
    }
}

export default FileReader