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
 * * **`message.applicationRootDir`** (optional) - The root directory of the application
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

import { copyFile, mkdir, readdir, stat } from 'node:fs/promises'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Service from '../base/Service.js'


class FileCopy extends Service {
    constructor(config) {
        super(config)
    }

    /**
     * Executes the file copy operation
     * @param {Object} message - The input message
     */
    async execute(message) {
        var source, destination

        // Determine source and destination paths
        if (this.configKey === 'undefined') {
            logger.debug('FileCopy: Using message.source and message.destination')
            source = message.source
            destination = message.destination
        } else {
            logger.debug(`FileCopy: Using configKey ${this.configKey.value}`)
            source = this.getPropertyFromMyConfig(ns.trm.source)
            destination = this.getPropertyFromMyConfig(ns.trm.destination)
            source = path.join(message.applicationRootDir, source)
            destination = path.join(message.applicationRootDir, destination)
        }

        logger.debug(`Source: ${source}`)
        logger.debug(`Destination: ${destination}`)

        try {
            await this.ensureDirectoryExists(path.dirname(destination))
            const sourceStat = await stat(source)

            if (sourceStat.isFile()) {
                logger.debug(`Copying file from ${source} to ${destination}`)
                await copyFile(source, destination)
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

    /**
     * Ensures the specified directory exists, creating it if necessary
     * @param {string} dirPath - The directory path to ensure
     */
    async ensureDirectoryExists(dirPath) {
        logger.debug(`Ensuring directory exists: ${dirPath}`)
        try {
            await mkdir(dirPath, { recursive: true })
            logger.debug(`Directory created/ensured: ${dirPath}`)
        } catch (err) {
            logger.debug(`Error creating directory ${dirPath}: ${err.message}`)
            throw err
        }
    }

    /**
     * Recursively copies a directory and its contents
     * @param {string} source - The source directory path
     * @param {string} destination - The destination directory path
     */
    async copyDirectory(source, destination) {
        logger.debug(`Copying directory: ${source} to ${destination}`)
        try {
            await this.ensureDirectoryExists(destination)
            const entries = await readdir(source, { withFileTypes: true })

            for (const entry of entries) {
                const srcPath = path.join(source, entry.name)
                const destPath = path.join(destination, entry.name)

                logger.debug(`Processing: ${srcPath} to ${destPath}`)

                if (entry.isDirectory()) {
                    await this.copyDirectory(srcPath, destPath)
                } else {
                    await copyFile(srcPath, destPath)
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