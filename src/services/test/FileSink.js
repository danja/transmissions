import path from 'path'
import { fileURLToPath } from 'url'

import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import fs from "node:fs"
import SinkService from '../../mill/SinkService.js';

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
        // const filename = "erwerwer"
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename)
        const rootDir = path.resolve(__dirname, '../../../')
        const filePath = path.join(rootDir, this.destinationFile)
        logger.debug("sink filePath = " + filePath)
        await writeFile(filePath, data);
    }
}

export default FileSink
