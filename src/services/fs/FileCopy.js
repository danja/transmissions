import { copyFile, mkdir, readdir, stat } from 'node:fs/promises'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Service from '../base/Service.js'

class FileCopy extends Service {
    constructor(config) {
        super(config)
    }

    async execute(message) {
        var source, destination

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