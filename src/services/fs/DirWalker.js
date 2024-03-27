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
        this.desiredExtensions = ['.html']
        /* 
        const cwd = process.cwd() + '/../' // move!
        this.sourceFile = cwd + poi.out(ns.trm.sourceFile).value
        */
    }

    async execute(dirPath, context) {
        logger.log("Start path = " + dirPath)
        try {
            const entries = await readdir(dirPath, { withFileTypes: true })
            for (const entry of entries) {
                const fullPath = join(dirPath, entry.name)
                if (entry.isDirectory()) {
                    await this.execute(fullPath, context) // rearrange to make things easier to read?
                } else {
                    // Check if the file extension is in the list of desired extensions
                    if (this.desiredExtensions.includes(extname(entry.name))) {
                        logger.log("in DirWalker fullPath : " + fullPath)
                        this.emit('message', fullPath, context)
                    }
                }
            }
        } catch (err) {
            logger.error("DirWalker.execute error : " + err.message)
        }
    }
}

export default DirWalker
