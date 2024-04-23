import { readdir } from 'fs/promises'
import { join, extname } from 'path'

import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
// import { EventEmitter } from 'events'

import SourceService from '../base/SourceService.js'

class DirWalker extends SourceService {

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        /////////////////////////
        this.desiredExtensions = ['.md']
        /* 
        const cwd = process.cwd() + '/../' // move!
        this.sourceFile = cwd + poi.out(ns.trm.sourceFile).value
        */
    }

    async execute(relativePath, context) {
        /*
        if (relativePath === this.doneMessage) {
            this.emit('message', this.doneMessage, context)
            return
        }
        */
        const dirPath = context.rootDir + '/' + relativePath
        //     logger.log("Start path = " + dirPath)

        try {
            const entries = await readdir(dirPath, { withFileTypes: true })
            for (const entry of entries) {
                const fullPath = join(dirPath, entry.name)
                if (entry.isDirectory()) {
                    await this.execute(entry.name, context) // rearrange to make things easier to read?
                } else {
                    // Check if the file extension is in the list of desired extensions
                    if (this.desiredExtensions.includes(extname(entry.name))) {
                        // logger.log("in DirWalker fullPath : " + fullPath)
                        const contextClone = structuredClone(context)
                        contextClone.sourceFile = entry.name
                        //  this.setContext(context, entry.name)
                        logger.log('\n\nDIR entry.name = ' + entry.name)
                        logger.log('DIR  context.sourceFile = ' + contextClone.sourceFile)
                        this.emit('message', fullPath, contextClone)
                        //    this.doEmit('message', fullPath, context)
                    }
                }
            }
        } catch (err) {
            logger.error("DirWalker.execute error : " + err.message)
        }
    }

    //   async setContext(context, sourceFile) {
    //     context.sourceFile = sourceFile
    //   logger.log('\nDIR2  context.sourceFile = ' + context.sourceFile)
    // }
}

export default DirWalker
