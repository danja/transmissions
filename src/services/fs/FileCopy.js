import { copyFile, mkdir, readdir, stat } from 'node:fs/promises'
import path from 'path'

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import footpath from '../../utils/footpath.js'

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
     * @param {string} message.source - The source path (ignored if there's a configKey from transmission)
     * @param {string} message.destination - The destination path  (ignored if there's a configKey from transmission)
     */
    async execute(message) {
        //  try {
        var source, destination

        if (this.configKey === 'undefined') {
            logger.log('FileCopy no configKey from transmission, using message.source, message.destination')
            source = message.source
            destination = message.destination
        } else {
            logger.log('FileCopy this.configKey = ' + this.configKey.value)
            source = this.getPropertyFromMyConfig(ns.trm.source)
            destination = this.getPropertyFromMyConfig(ns.trm.destination)

            source = path.join(message.applicationRootDir, source)
            destination = path.join(message.applicationRootDir, destination)



            // logger.debug('FileSource file : ' + sf)

            //   const currentDir = dirname(fileURLToPath(import.meta.url));
            // Navigate up to the application root
            // this.rootDir = path.join(currentDir, '..', '..', 'applications', 'file-copy-remove-test');

        }
        //  logger.log('message.dataDir = ' + message.dataDir)
        //    logger.log('message.applicationRootDir = ' + message.applicationRootDir)
        logger.log('source = ' + source)
        logger.log('destination = ' + destination)
        // this.showMyConfig()


        const sourceStat = await stat(source)

        if (sourceStat.isFile()) {
            await this.copyFile(source, destination)
        } else if (sourceStat.isDirectory()) {
            await this.copyDirectory(source, destination)
        }

        this.emit('message', message)
        // } catch (err) {
        //   logger.error("FileCopy.execute error: " + err.message)
        // }
    }

    /**
     * Copies a file to the destination directory.
     * @param {string} source - The source file path.
     * @param {string} destination - The destination directory path.
     */
    async copyFile(source, destination) {
        try {
            const destPath = path.join(destination, source.split('/').pop())
            logger.log('source = ' + source)
            logger.log('destPath = ' + destPath)
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
            const destDir = path.join(destination, source.split('/').pop())
            await mkdir(destDir, { recursive: true })
            const entries = await readdir(source, { withFileTypes: true })

            for (const entry of entries) {
                const srcPath = path.join(source, entry.name)
                const destPath = path.join(destDir, entry.name)

                //   logger.log('srcPath = ' + srcPath)
                //   logger.log('destPath = ' + destPath)

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