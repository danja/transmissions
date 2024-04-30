import { readdir } from 'fs/promises'
import { join, extname } from 'path'
import grapoi from 'grapoi'
import logger from '../../utils/Logger.js'


import SourceService from '../base/SourceService.js'

class DirWalker extends SourceService {

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        this.desiredExtensions = ['.md']
    }


    async execute(data, context) {
        //  logger.log('DirWalkerDirWalkerDirWalkerDirWalker ' + context.template)
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
                        const contextClone = structuredClone(context)
                        contextClone.filename = entry.name
                        logger.log('\n\nDIR entry.name = ' + entry.name)
                        logger.log('DIR  context.sourceFile = ' + contextClone.filename)
                        this.emit('message', false, contextClone)
                    }
                }
            }
        } catch (err) {
            logger.error("DirWalker.execute error : " + err.message)
        }
    }
}
export default DirWalker
