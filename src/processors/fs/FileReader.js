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

    // TODO use src/utils/SysUtils.js  resolveFilePath(message, property, default)
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
            filePath = this.getProperty(ns.trn.sourceFile, null)
            if (!filePath) {
                logger.warn(`No source file path provided, defaulting to ${this.defaultFilePath}`)
                filePath = this.defaultFilePath
            }

            logger.debug(`filePath = ${filePath}`)
            // Resolve relative to targetPath or rootDir

            if (typeof filePath === 'string' && !path.isAbsolute(filePath)) {
                // First try with workingDir
                const workingDir = this.app.workingDir
                logger.debug(`this.app.workingDir = ${this.app.workingDir}`)
                // Try the file path as is
                const possiblePath = path.join(workingDir, filePath)

                try {
                    access(possiblePath, constants.R_OK, (err) => {
                        if (err) {
                            throw new Error(`File not accessible: ${possiblePath}`)
                        }
                    })
                    filePath = possiblePath
                } catch (err) {
                    // If not found, try with data/ prefix
                    const dataPath = path.join(workingDir, 'data', filePath)
                    try {
                        access(dataPath, constants.R_OK, (err) => {
                            if (err) {
                                throw new Error(`File not accessible: ${dataPath}`)
                            }
                        })
                        filePath = dataPath
                    } catch (err) {
                        throw new Error(`File not found in expected locations: ${possiblePath}, ${dataPath}`)
                    }
                }
            }
        }

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