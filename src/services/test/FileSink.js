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
        // const map = poi.out(ns.rdf.type, ns.trm.DataMap).term
        //  const cwd = process.cwd() + '/../../' // move!
        this.destinationFile = poi.out(ns.trm.destinationFile).value
    }

    async execute(data) {
        const sf = footpath.resolve(import.meta.url, '../../../', this.destinationFile)
        /*
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename)
        const rootDir = path.resolve(__dirname, '../../../')
        const filePath = path.join(rootDir, this.destinationFile)
        */
        logger.debug("FileSink to = " + sf)
        await writeFile(sf, data);
    }
}

export default FileSink
