import path from 'path'
import { fileURLToPath } from 'url'

import { writeFile } from 'node:fs/promises'
import footpath from '../../../utils/footpath.js'
import grapoi from 'grapoi'
import ns from '../../../utils/ns.js'
import logger from '../../../utils/Logger.js'
import Processor from '../../../model/Processor.js'

class FileSink extends Processor {

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        this.destinationFile = poi.out(ns.trn.destinationFile).value
    }

    // In FileSink.js
    async process(message) {
        const toRootDir = '../../../'
        const workingDir = path.join(toRootDir, message.workingDir)
        const df = footpath.resolve(import.meta.url, workingDir, this.destinationFile)
        logger.debug("FileSink to = " + df)
        await writeFile(df, message.content)
        return this.emit('message', message)
    }
}

export default FileSink
