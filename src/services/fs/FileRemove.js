import { unlink, readdir, stat, rm } from 'node:fs/promises'
import path from 'path'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

/**
 * FileRemove class that extends Service.
 * Removes files or directory contents based on the provided path.
 */
class FileRemove extends Service {

    /**
     * Constructs a new FileRemove instance.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Removes the specified file or directory contents.
     * @param {Object} message - The message object.
     * @param {string} message.remove - The path to the file or directory to remove.
     */
    async execute(message) {
     
        var target

        if (this.configKey === 'undefined') {
            logger.debug('FileRemove no configKey from transmission, using message.target')
         target =   message.target
        } else {
            logger.debug('FileCopy this.configKey = ' + this.configKey.value)
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
     * Removes a file.
     * @param {string} filePath - The path to the file to remove.
     */
    async removeFile(filePath) {
            await unlink(filePath)
    }

    /**
     * Removes the contents of a directory recursively.
     * @param {string} dirPath - The path to the directory.
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