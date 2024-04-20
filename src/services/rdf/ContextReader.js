
import { readFile } from 'node:fs/promises'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import SourceService from '../base/SourceService.js'

class ContextReader extends SourceService {

    constructor(config) {
        super(config)
    }

    async execute(data, context) {
        logger.debug("context file = " + data.toString())

        /*
       var filename = context.sourceFile

       if (!filename) {
           filename = this.locateConfig().value
       }
       // logger.debug("FileReader sourceFile = " + filename)

       const f = footpath.resolve(context.runScript, './data/', filename)

       logger.debug("f = " + f)
       */
        try {
            const content = await readFile(data)
            logger.log('in ContextReader, content = ' + content)
            this.emit('message', content, context)
        } catch (err) {
            logger.error("FileReader.execute error : " + err.message)
        }
    }
}

export default ContextReader