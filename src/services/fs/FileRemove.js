import { unlink, readdir, stat, rm } from 'node:fs/promises'
import { join } from 'node:path'
import logger from '../../utils/Logger.js'
import Service from '../../base/Service.js'

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
     * @param {Object} context - The context object.
     * @param {string} context.remove - The path to the file or directory to remove.
     */
    async execute(context) {
        try {
            const { remove } = context
            const removeStat = await stat(remove)

            if (removeStat.isFile()) {
                await this.removeFile(remove)
            } else if (removeStat.isDirectory()) {
                await this.removeDirectoryContents(remove)
            }

            this.emit('message', context)
        } catch (err) {
            logger.error("FileRemove.execute error: " + err.message)
        }
    }

    /**
     * Removes a file.
     * @param {string} filePath - The path to the file to remove.
     */
    async removeFile(filePath) {
        try {
            await unlink(filePath)
        } catch (err) {
            logger.error("FileRemove.removeFile error: " + err.message)
        }
    }

    /**
     * Removes the contents of a directory recursively.
     * @param {string} dirPath - The path to the directory.
     */
    async removeDirectoryContents(dirPath) {
        try {
            const entries = await readdir(dirPath, { withFileTypes: true })

            for (const entry of entries) {
                const entryPath = join(dirPath, entry.name)

                if (entry.isDirectory()) {
                    await this.removeDirectoryContents(entryPath)
                } else {
                    await unlink(entryPath)
                }
            }
        } catch (err) {
            logger.error("FileRemove.removeDirectoryContents error: " + err.message)
        }
    }
}

export default FileRemove