import rdf from 'rdf-ext'
import ns from '../../utils/ns.js'
import { readdir } from 'fs/promises'
import { join, extname } from 'path'
import grapoi from 'grapoi'
import logger from '../../utils/Logger.js'


import SourceService from '../base/SourceService.js'

/**
 * Represents a directory walker service that traverses a directory and emits messages for files with desired extensions.
 * @extends SourceService
 * 
 * #### __*Input*__
 * * context.rootDir 
 * * context.sourceDir
 * #### __*Output*__
 * * context.filename (multi)
 * 
 */
class DirWalker extends SourceService {

    /**
     * Creates an instance of DirWalker.
     * @param {Object} config - The configuration object for the DirWalker service.
     */
    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        this.desiredExtensions = ['.md']
    }

    /**
     * Executes the directory walking process.
     * @param {any} data - The data to be passed to the execute method.
     * @param {Object} context - The context object containing information about the directory and source file.
     * @returns {Promise<void>} A promise that resolves when the directory walking process is complete.
     */
    async execute(data, context) {

        await this.emitThem(context)


        // logger.error("§§§ DirWalker emit true : " + contextClone.done)
        context.done = true
        //  logger.error("§§§ DirWalker emit B : " + contextClone.done)
        this.emit('message', false, context)
    }

    async emitThem(context) {
        context.counter = 0
        context.slugs = []
        context.done = false // maybe insert earlier
        const dirPath = context.rootDir + '/' + context.sourceDir
        try {
            const entries = await readdir(dirPath, { withFileTypes: true })
            for (const entry of entries) {
                const fullPath = join(dirPath, entry.name)
                if (entry.isDirectory()) {
                    await this.execute(entry.name, context) // rearrange to make things easier to read?
                } else {
                    // Check if the file extension is in the list of desired extensions
                    if (this.desiredExtensions.includes(extname(entry.name))) {

                        context.filename = entry.name
                        context.filepath = context.sourceDir + '/' + entry.name
                        const slug = this.extractSlug(context.filename)
                        context.slugs.push(slug)
                        // globalish
                        //    this.addPropertyToMyConfig(ns.trm.postPath, rdf.literal(context.filename))
                        //  logger.log('CONFIG : ' + this.config)

                        //   this.showMyConfig()
                        context.done = false
                        context.counter = context.counter + 1
                        const contextClone = structuredClone(context) // move?
                        this.emit('message', false, contextClone)
                    }
                }
            }
        } catch (err) {
            logger.error("DirWalker.execute error : " + err.message)
        }
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
