import { readdir } from 'fs/promises'
import { join, extname } from 'path'
import grapoi from 'grapoi'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

/*
TODO add handling for paths given in processors.ttl, see FileCopy
*/

/**
 * Represents a directory walker processor that traverses a directory and emits messages for files with desired extensions.
 * @extends Processor
 * 
 * #### __*Input*__
 * * message.rootDir 
 * * message.sourceDir
 * #### __*Output*__
 * * message.filename (multi)
 * 
 */
class DirWalker extends Processor {

    /**
     * Creates an instance of DirWalker.
     * @param {Object} config - The configuration object for the DirWalker processor.
     */
    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        this.includeExtensions = ['.md']
        this.excludePrefixes = ['_']
    }

    /**
     * Executes the directory walking process.
     * @param {Object} message - The message object containing information about the directory and source file.
     * @returns {Promise<void>} A promise that resolves when the directory walking process is complete.
     */
    async process(message) {
        logger.setLogLevel('info')
        logger.debug('DirWalker.process')
        await this.emitThem(message)


        // logger.error("§§§ DirWalker emit true : " + messageClone.done)
        message.done = true
        //  logger.error("§§§ DirWalker emit B : " + messageClone.done)
        this.emit('message', message)
    }

    async emitThem(message) {
        message.counter = 0
        message.slugs = []
        message.done = false // maybe insert earlier

        if (!message.sourceDir) {
            message.sourceDir = "."
        }

        let dirPath
        if (message.targetPath) {
            dirPath = join(message.targetPath, message.sourceDir)
        } else {
            dirPath = join(message.rootDir, message.sourceDir)
        }
        logger.debug('DirWalker, dirPath = ' + dirPath)
        // try {

        const entries = await readdir(dirPath, { withFileTypes: true })
        for (const entry of entries) {
            const fullPath = join(dirPath, entry.name)
            if (entry.isDirectory()) {
                await this.process(entry.name, message) // rearrange to make things easier to read?
            } else {
                logger.debug('DirWalker, entry.name = ' + entry.name)

                const includeExtension = this.includeExtensions.includes(extname(entry.name))
                const prefix = entry.name.charAt(0)
                const excludePrefix = this.excludePrefixes.includes(prefix)

                // Check if the file extension is in the list of desired extensions
                if (!excludePrefix && includeExtension) {

                    message.filename = entry.name
                    message.filepath = join(message.sourceDir, entry.name)

                    const slug = this.extractSlug(message.filename)
                    message.slugs.push(slug)
                    // globalish
                    //    this.addPropertyToMyConfig(ns.trm.postPath, rdf.literal(message.filename))
                    //  logger.log('CONFIG : ' + this.config)

                    //   this.showMyConfig()
                    message.done = false
                    message.counter = message.counter + 1
                    const messageClone = structuredClone(message) // move?
                    this.emit('message', messageClone)
                }
            }
        }
        //    } catch (err) {
        //   logger.error("DirWalker.execute error : " + err.message)
        //    throw err
        //  }
    }

    extractSlug(filepath) { // TODO move this into a utils file - similar in PostcraftPrep
        var slug = filepath
        if (slug.includes('.')) {
            slug = slug.substr(0, slug.lastIndexOf("."))
        }
        return slug
    }
}
export default DirWalker
