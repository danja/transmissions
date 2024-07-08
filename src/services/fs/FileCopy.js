import { copyFile, mkdir, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

/**
 * FileCopy class that extends Service.
 * Copies files or directories to a specified destination.
 */
class FileCopy extends Service {

    /**
     * Constructs a new FileCopy instance.
     * @param {Object} config - The configuration object.
     */
    constructor(config) {
        super(config)
    }

    /**
     * Copies the source to the destination.
     * @param {Object} message - The message object.
     * @param {string} message.source - The source path.
     * @param {string} message.destination - The destination path.
     */
    async execute(message) {
        try {
            const { source, destination } = message
            const sourceStat = await stat(source)

            if (sourceStat.isFile()) {
                await this.copyFile(source, destination)
            } else if (sourceStat.isDirectory()) {
                await this.copyDirectory(source, destination)
            }

            this.emit('message', message)
        } catch (err) {
            logger.error("FileCopy.execute error: " + err.message)
        }
    }

    /**
     * Copies a file to the destination directory.
     * @param {string} source - The source file path.
     * @param {string} destination - The destination directory path.
     */
    async copyFile(source, destination) {
        try {
            const destPath = join(destination, source.split('/').pop())
            await copyFile(source, destPath)
        } catch (err) {
            logger.error("FileCopy.copyFile error: " + err.message)
        }
    }

    /**
     * Recursively copies a directory and its contents to the destination directory.
     * @param {string} source - The source directory path.
     * @param {string} destination - The destination directory path.
     */
    async copyDirectory(source, destination) {
        try {
            const destDir = join(destination, source.split('/').pop())
            await mkdir(destDir, { recursive: true })
            const entries = await readdir(source, { withFileTypes: true })

            for (const entry of entries) {
                const srcPath = join(source, entry.name)
                const destPath = join(destDir, entry.name)

                if (entry.isDirectory()) {
                    await this.copyDirectory(srcPath, destPath)
                } else {
                    await copyFile(srcPath, destPath)
                }
            }
        } catch (err) {
            logger.error("FileCopy.copyDirectory error: " + err.message)
        }
    }
}

export default FileCopy