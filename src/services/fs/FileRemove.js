// src/services/fs/FileRemove.js
/**
 * FileRemove Service
 * 
 * Removes files or directory contents on the local filesystem.
 * @extends Service
 * 
 * #### __*Input*__
 * * message.applicationRootDir (optional) - The root directory of the application
 * * message.target (if no configKey) - The path of the file or directory to remove
 * 
 * #### __*Configuration*__
 * If a configKey is provided in the transmission:
 * * ns.trm.target - The target path relative to applicationRootDir
 * 
 * #### __*Output*__
 * * Removes the specified file or directory contents
 * * message (unmodified) - The input message is passed through
 * 
 * #### __*Behavior*__
 * * Removes individual files directly
 * * Recursively removes directory contents
 * * Logs debug information about the removal process
 * 
 * #### __Tests__
 * `./run file-copy-remove-test`
 * `npm test -- tests/integration/file-copy-remove-test.spec.js`
 * 
 */

import { unlink, readdir, stat, rm } from 'node:fs/promises'
import path from 'path'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class FileRemove extends Service {
    constructor(config) {
        super(config)
    }

    /**
     * Executes the file or directory removal operation
     * @param {Object} message - The input message
     */
    async execute(message) {
        var target

        // Determine target path
        if (this.configKey === 'undefined') {
            logger.debug('FileRemove no configKey from transmission, using message.target')
            target = message.target
        } else {
            logger.debug('FileRemove this.configKey = ' + this.configKey.value)
            target = this.getPropertyFromMyConfig(ns.trm.target)
            target = path.join(message.applicationRootDir, target)
        }

        const removeStat = await stat(target)

        if (removeStat.isFile()) {
            await this.removeFile(target)
        } else if (removeStat.isDirectory()) {
            await this.removeDirectoryContents(target)
        }

        this.emit('message', message)
    }

    /**
     * Removes a file
     * @param {string} filePath - The path to the file to remove
     */
    async removeFile(filePath) {
        await unlink(filePath)
    }

    /**
     * Recursively removes the contents of a directory
     * @param {string} dirPath - The path to the directory
     */
    async removeDirectoryContents(dirPath) {
        const entries = await readdir(dirPath, { withFileTypes: true })

        for (const entry of entries) {
            const entryPath = path.join(dirPath, entry.name)

            if (entry.isDirectory()) {
                await this.removeDirectoryContents(entryPath)
            } else {
                await unlink(entryPath)
            }
        }
    }
}

export default FileRemove