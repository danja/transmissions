import path from 'path'
import { fileURLToPath } from 'url'

import { writeFile } from 'node:fs/promises';
import footpath from '../../utils/footpath.js'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import SinkService from '../base/SinkService.js'

class FileSink extends SinkService {

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        this.destinationFile = poi.out(ns.trm.destinationFile).value
    }

    async execute(context) {
        const toRootDir = '../../../'
        const dataDir = path.join(toRootDir, context.dataDir)

        const df = footpath.resolve(import.meta.url, dataDir, this.destinationFile)

        logger.debug("FileSink to = " + df)

        await writeFile(df, data)

        this.emit('message', context)
    }
}

export default FileSink
