import { readFile } from 'node:fs/promises'
import { access, constants, statSync } from 'node:fs'
import path from 'path'
import mime from 'node-mime-types'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'

class FileReader extends Processor {
    constructor(config) {
        super(config)
        this.defaultFilePath = 'input/input.md'
    }

    async process(message) {
        logger.trace(`FileReader.process, done=${message.done}`)

        if (message.done) return

        let filePath

        // TODO tidy up
        // First try deriving path from message properties
        if (message.fullPath) {
            filePath = message.fullPath
        } else if (message.filepath) {
            if (message.targetPath && !path.isAbsolute(message.filepath)) {
                filePath = path.join(message.targetPath, message.filepath)
            } else {
                filePath = message.filepath
            }
        } else {
            // Fall back to getting path from config
            filePath = await this.getProperty(ns.trn.sourceFile)
            if (!filePath) {
                logger.warn(`No source file path provided, defaulting to ${this.defaultFilePath}`)
                filePath = this.defaultFilePath
            }

            logger.trace(`filePath = ${filePath}`)
            // Resolve relative to targetPath or rootDir

            if (!path.isAbsolute(filePath)) {
                //     filePath = path.join(message.targetPath || message.rootDir, filePath)
                filePath = path.join(message.targetPath || message.workingDir, filePath)
            }
        }

        logger.trace(`FileReader.process(), reading file: ${filePath}`)
        logger.trace(`FileReader.process(), process.cwd() = ${process.cwd()}`)

        // Verify file is readable
        await new Promise((resolve, reject) => {
            access(filePath, constants.R_OK, (err) => {
                if (err) {
                    reject(new Error(`File ${filePath} is not readable: ${err.message}`))
                }
                resolve()
            })
        })

        // Handle metadata if requested
        const metaField = await super.getProperty(ns.trn.metaField)
        if (metaField) {
            const metadata = this.getFileMetadata(filePath)
            message[metaField] = metadata
        }


        // Read and return file content
        const content = await readFile(filePath, 'utf8')
        logger.debug(` - FileReader read: ${filePath}`)

        message.filePath = filePath

        const mediaType = super.getProperty(ns.trn.mediaType)
        logger.trace(`mediaType = ${mediaType}`)

        if (mediaType === 'application/json') {
            message.content = JSON.parse(content)
        } else {
            message.content = content
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
            logger.error(`Error getting file metadata: ${error.message}`)
            return null
        }
    }
}

export default FileReader