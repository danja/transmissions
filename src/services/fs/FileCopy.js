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
            logger.debug('FileCopy no configKey from transmission, using message.source, message.destination')
            source = message.source
            destination = message.destination
        } else {
            logger.debug('FileCopy this.configKey = ' + this.configKey.value)
            source = this.getPropertyFromMyConfig(ns.trm.source)
            destination = this.getPropertyFromMyConfig(ns.trm.destination)

            source = path.join(message.applicationRootDir, source)
            destination = path.join(message.applicationRootDir, destination)
        }

        logger.log('\nsource = ' + source)
        logger.log('destination = ' + destination+'\n')
        // this.showMyConfig()

        const sourceStat = await stat(source)

        // const destPath = path.join(destination, source.split('/').pop())

        if (sourceStat.isFile()) {
            logger.log('copying file')
            await copyFile(source, destination)
          //  await this.copyFile(source, destination)
        } else if (sourceStat.isDirectory()) {
            logger.log('copying dir')
            await this.copyDirectory(source, destination)
        }

        this.emit('message', message)
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