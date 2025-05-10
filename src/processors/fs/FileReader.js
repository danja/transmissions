import { readFile } from 'node:fs/promises'
import { access, constants, statSync } from 'node:fs'
import path from 'path'
import mime from 'node-mime-types'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import PathResolver from '../../utils/PathResolver.js'

class FileReader extends Processor {
    constructor(config) {
        super(config)
        this.defaultFilePath = 'input/input.md'
    }

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