import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import fs from "node:fs"
import SinkService from '../base/SinkService.js';

class FileWriter extends SinkService {

    constructor(config) {
        super(config)
    }

    async execute(data, context) {
        var filename = context.targetFile

        if (!filename) {
            filename = this.locateConfig().value
        }
        logger.debug("Filewriter.targetFile = " + filename)


        const f = footpath.resolve(import.meta.url, '../../../', filename)
        try {
            //  logger.log("Filewriter writing " + f)
            await writeFile(f, data)
            //    logger.debug(content.toString())
            //  const context = { filename: filename }
            //   this.emit('message', data, context)
            // process.exit()
        } catch (err) {
            logger.error("FileWriter.execute error : " + err.message)
        }

        this.emit('message', data, context)
    }
}

export default FileWriter
