// src/services/fs/FileCopy.js
/**
 * @class FileCopy
 * @extends Service
 * @classdesc
 * **a Transmissions Service**
 * 
 * Copies files or entire directories on the local filesystem.
 * 
 * #### __*Configuration*__
 * If a `configKey` is provided in the transmission:
 * * **`ns.trm.source`** - The source path relative to `applicationRootDir`
 * * **`ns.trm.destination`** - The destination path relative to `applicationRootDir`
 * 
 * #### __*Input*__
 * * **`message.rootDir`** (optional) - The root directory of the operation
 * * **`message.applicationRootDir`** (optional) - The root directory of the application, fallback `rootDir`
 * * **`message.source`** (if no `configKey`) - The source path of the file or directory to copy
 * * **`message.destination`** (if no `configKey`) - The destination path for the copied file or directory
 * 
 * #### __*Output*__
 * * **`message`** - unmodified
 * 
 * #### __*Behavior*__
 * * Copies the specified file or directory to the destination
 * * Checks and creates target directories if they don't exist
 * * Copies individual files directly
 * * Recursively copies directories and their contents
 * * Logs detailed information about the copying process for debugging
 * 
 * #### __Tests__
 * * **`./run file-copy-remove-test`**
 * * **`npm test -- tests/integration/file-copy-remove-test.spec.js`**
 */
import path from 'path'
import fs from 'fs/promises'
import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'
import ns from '../../utils/ns.js'

class FileCopy extends Service {
    constructor(config) {
        super(config)
    }

    async execute(message) {
        logger.debug("message.rootDir = " + message.rootDir)

        let source = message.source || this.getPropertyFromMyConfig(ns.trm.source)
        let destination = message.destination || this.getPropertyFromMyConfig(ns.trm.destination)

        // Ensure source is an absolute path
        if (!path.isAbsolute(source)) {
            source = path.resolve(process.cwd(), source)
        }

        // Ensure destination is an absolute path
        if (!path.isAbsolute(destination)) {
            destination = path.resolve(message.rootDir, destination)
        }

        logger.debug(`Source: ${source}`)
        logger.debug(`Destination: ${destination}`)

        try {
            await this.ensureDirectoryExists(destination)
            const sourceStat = await fs.stat(source)
            if (sourceStat.isFile()) {
                logger.debug(`Copying file from ${source} to ${destination}`)
                await fs.copyFile(source, destination)
            } else if (sourceStat.isDirectory()) {
                logger.debug(`Copying directory from ${source} to ${destination}`)
                await this.copyDirectory(source, destination)
            }
        } catch (err) {
            logger.error(`Error in FileCopy: ${err.message}`)
            logger.error(`Source: ${source}`)
            logger.error(`Destination: ${destination}`)
        }

        this.emit('message', message)
    }

    async ensureDirectoryExists(dirPath) {
        logger.debug(`Ensuring directory exists: ${dirPath}`)
        try {
            await fs.mkdir(dirPath, { recursive: true })
            logger.debug(`Directory created/ensured: ${dirPath}`)
        } catch (err) {
            logger.debug(`Error creating directory ${dirPath}: ${err.message}`)
            throw err
        }
    }

    async copyDirectory(source, destination) {
        logger.debug(`Copying directory: ${source} to ${destination}`)
        try {
            await this.ensureDirectoryExists(destination)
            const entries = await fs.readdir(source, { withFileTypes: true })
            for (const entry of entries) {
                const srcPath = path.join(source, entry.name)
                const destPath = path.join(destination, entry.name)
                logger.debug(`Processing: ${srcPath} to ${destPath}`)
                if (entry.isDirectory()) {
                    await this.copyDirectory(srcPath, destPath)
                } else {
                    await fs.copyFile(srcPath, destPath)
                    logger.debug(`File copied: ${srcPath} to ${destPath}`)
                }
            }
        } catch (err) {
            logger.debug(`Error in copyDirectory: ${err.message}`)
            throw err
        }
    }
}

export default FileCopy