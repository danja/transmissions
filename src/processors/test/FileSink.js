import path from 'path'
import { fileURLToPath } from 'url'

import { writeFile } from 'node:fs/promises';
import footpath from '../../utils/footpath.js'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import SinkProcessor from '../base/SinkProcessor.js'

class FileSink extends SinkProcessor {

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        this.destinationFile = poi.out(ns.trm.destinationFile).value
    }

    // In FileSink.js
    async execute(message) {
        const toRootDir = '../../../'
        const dataDir = path.join(toRootDir, message.dataDir)
        const df = footpath.resolve(import.meta.url, dataDir, this.destinationFile)
        logger.debug("FileSink to = " + df)
        await writeFile(df, message.content)
        this.emit('message', message)
    }
}

export default FileSink
