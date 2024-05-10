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
        const contextClone = structuredClone(context) // move?
        context.filepaths = []
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

                        contextClone.filename = entry.name
                        contextClone.filepath = context.sourceDir + '/' + entry.name

                        // globalish
                        //    this.addPropertyToMyConfig(ns.trm.postPath, rdf.literal(contextClone.filename))
                        //  logger.log('CONFIG : ' + this.config)
                        // process.exit()
                        //   this.showMyConfig()
                        this.emit('message', false, contextClone)
                    }
                }
            }

        } catch (err) {
            logger.error("DirWalker.execute error : " + err.message)
        }
        this.done = true
        contextClone.done = this.done
        this.emit('message', false, contextClone)
    }
}
export default DirWalker
