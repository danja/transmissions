// src/processors/fs/FileRemove.js
/**
 * FileRemove Processor
 *
 * Removes files or directory contents on the local filesystem.
 * @extends Processor
 *
 * #### __*Input*__
 * * message.applicationRootDir (optional) - The root directory of the application
 * * message.target (if no settings) - The path of the file or directory to remove
 *
 * #### __*Configuration*__
 * If a settings is provided in the transmission:
 * * ns.trn.target - The target path relative to applicationRootDir
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
import Processor from '../../model/Processor.js'

class FileRemove extends Processor {
    constructor(config) {
        super(config)
    }

    /**
     * Executes the file or directory removal operation
     * @param {Object} message - The input message
     */
    async process(message) {

        //  logger.setLogLevel('debug')

        this.ignoreDotfiles = true // default, simplify ".gitinclude"

        var target = await this.getProperty(ns.trn.target)
          const wd = super.getProperty(ns.trn.workingDir)
          target = path.join(wd,target)
        logger.debug('FileRemove, target = ' + target)
     
     //   return this.emit('message', message)
        try {
            const removeStat = await stat(target)

            if (removeStat.isFile()) {
                await this.removeFile(target)
            } else if (removeStat.isDirectory()) {
                await this.removeDirectoryContents(target)
            }
        } catch (err) {
            // probably already gone
            logger.debug('FileRemove, target stat caused err : ' + target)
        }

        return this.emit('message', message)
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
        logger.debug('FileRemove, dirPath = ' + dirPath)
        const entries = await readdir(dirPath, { withFileTypes: true })

        for (const entry of entries) {
            if (this.ignoreDotfiles && (entry.name.charAt(0) === ".")) {
                continue
            }
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