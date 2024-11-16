import path from 'path'
import { fileURLToPath } from 'url'

import { writeFile } from 'node:fs/promises'
import footpath from '../../utils/footpath.js'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class FileSink extends Processor {

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        this.destinationFile = poi.out(ns.trm.destinationFile).value
    }

    // In FileSink.js
    async process(message) {
        const toRootDir = '../../../'
        const dataDir = path.join(toRootDir, message.dataDir)
        const df = footpath.resolve(import.meta.url, dataDir, this.destinationFile)
        logger.debug("FileSink to = " + df)
        await writeFile(df, message.content)
        return this.emit('message', message)
    }
}

export default FileSink
