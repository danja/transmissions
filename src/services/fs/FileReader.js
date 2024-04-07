
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

    async execute(data, context) {
        //  const dataDir = context.runScript
        logger.debug("dataDir = " + context.dataDir)
        var filename = context.sourceFile

        if (!filename) {
            filename = this.locateConfig().value
        }
        logger.debug("FileReader sourceFile = " + filename)

        const f = footpath.resolve(context.runScript, './data/', filename)



        logger.debug("f = " + f)
        try {
            const content = await readFile(f)
            //    logger.debug(content.toString())
            //  const context = { filename: filename }
            this.emit('message', content, context)
        } catch (err) {
            logger.error("FileReader.execute error : " + err.message)
        }
    }
}

export default FileReader