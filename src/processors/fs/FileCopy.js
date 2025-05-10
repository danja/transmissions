// src/processors/fs/FileCopy.js
/**
 * @class FileCopy
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Copies files or entire directories on the local filesystem.
 *
 * #### __*Configuration*__
 * If a `settings` is provided in the transmission:
 * * **`ns.trn.source`** - The source path relative to `applicationRootDir`
 * * **`ns.trn.destination`** - The destination path relative to `applicationRootDir`
 *
 * #### __*Input*__
 * * **`message.rootDir`** (optional) - The root directory of the operation
 * * **`message.applicationRootDir`** (optional) - The root directory of the application, fallback `rootDir`
 * * **`message.source`** (if no `settings`) - The source path of the file or directory to copy
 * * **`message.destination`** (if no `settings`) - The destination path for the copied file or directory
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
import Processor from '../../model/Processor.js'
import PathResolver from '../../utils/PathResolver.js'

class FileCopy extends Processor {
    constructor(config) {
        super(config)
    }

    /**
     * Executes the file copy operation
     * @param {Object} message - The input message
     */
    async process(message) {
        logger.debug("FileCopy.process")
        logger.debug("   message.rootDir = " + message.rootDir)

        // Use PathResolver to resolve source and destination
        const app = this.app || { workingDir: message.applicationRootDir || message.rootDir || process.cwd() }
        const getProperty = (prop, def) => this.getProperty(prop, def)
        const defaultSource = 'input/input.txt'
        const defaultDestination = 'output/output.txt'

        const source = await PathResolver.resolveFilePath({
            message,
            app,
            getProperty,
            defaultFilePath: defaultSource,
            sourceOrDest: ns.trn.source
        })
        const destination = await PathResolver.resolveFilePath({
            message: { ...message, filepath: undefined, fullPath: undefined }, // avoid confusion with source
            app,
            getProperty,
            defaultFilePath: defaultDestination,
            sourceOrDest: ns.trn.destination
        })

        logger.debug(`Source: ${source} `)
        logger.debug(`Destination: ${destination} `)

        try {
            await this.ensureDirectoryExists(path.dirname(destination))
            const sourceStat = await stat(source)

            if (sourceStat.isFile()) {
                logger.debug(`   Copying file from ${source} to ${destination} `)
                await copyFile(source, destination)
            } else if (sourceStat.isDirectory()) {
                logger.debug(`\nCopying directory from ${source} to ${destination} `)
                await this.copyDirectory(source, destination)
            }
        } catch (err) {
            if (err instanceof Error) {
                logger.error(`Error in FileCopy: ${err.message} `)
            } else {
                logger.error(`Unknown error in FileCopy.`)
            }
            logger.error(`Source: ${source} `)
            logger.error(`Destination: ${destination} `)
        }

        return this.emit('message', message)
    }

    /**
     * Ensures the specified directory exists, creating it if necessary
     * @param {string} dirPath - The directory path to ensure
     */
    async ensureDirectoryExists(dirPath) {
        logger.debug(`Ensuring directory exists: ${dirPath} `)
        try {
            await mkdir(dirPath, { recursive: true })
            logger.debug(`Directory created / ensured: ${dirPath} `)
        } catch (err) {
            if (err instanceof Error) {
                logger.debug(`Error creating directory ${dirPath}: ${err.message} `)
            } else {
                logger.debug(`Unknown error creating directory ${dirPath}.`)
            }
            throw err
        }
    }

    /**
     * Recursively copies a directory and its contents
     * @param {string} source - The source directory path
     * @param {string} destination - The destination directory path
     */
    async copyDirectory(source, destination) {
        logger.debug(`\nCopying directory: ${source} to ${destination} `)
        try {
            await this.ensureDirectoryExists(destination)
            const entries = await readdir(source, { withFileTypes: true })

            for (const entry of entries) {
                const srcPath = path.join(source, entry.name)
                const destPath = path.join(destination, entry.name)

                logger.debug(`   Processing: ${srcPath} to ${destPath} `)

                if (entry.isDirectory()) {
                    await this.copyDirectory(srcPath, destPath)
                } else {
                    await copyFile(srcPath, destPath)
                    logger.debug(`   File copied: ${srcPath} to ${destPath} `)
                }
            }
        } catch (err) {
            if (err instanceof Error) {
                logger.debug(`Error in copyDirectory: ${err.message} `)
            } else {
                logger.debug(`Unknown error in copyDirectory.`)
            }
            throw err
        }
    }
}

export default FileCopy