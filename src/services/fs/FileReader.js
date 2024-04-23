import { join, extname } from 'path'
import { readFile } from 'node:fs/promises'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import SourceService from '../base/SourceService.js'

class FileReader extends SourceService {

    constructor(config) {
        super(config)
    }

    async execute(filename, context) {
        logger.log('FileReader reading : ' + filename)
        // if (filename === this.doneMessage) {
        //   this.emit('message', this.doneMessage, context)
        //   return
        // }
        // logger.debug("dataDir = " + context.dataDir)
        // var filename = context.sourceFile

        if (!filename) {
            filename = this.locateConfig().value //?????????????
        }
        // logger.debug("FileReader sourceFile = " + filename)

        //   const f = footpath.resolve(context.runScript, './data/', filename)
        //    const f = join(context.rootDir, filename)
        const f = filename
        //  logger.debug("f = " + f)
        try {
            const content = await readFile(f)
            await this.doEmit('message', content, context)
        } catch (err) {
            logger.error("FileReader.execute error : " + err.message)
        }
    }


}

export default FileReader