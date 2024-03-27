import { writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';

import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import fs from "node:fs"
import SinkService from '../base/SinkService.js';

class FileWriter extends SinkService {

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        // const map = poi.out(ns.rdf.type, ns.trm.DataMap).term
        const cwd = process.cwd() + '/../' // move!
        this.destinationFile = cwd + poi.out(ns.trm.destinationFile).value
    }

    async execute(data, context) {
        //   logger.reveal(data)
        //   logger.debug('data.filename = ' + data.filename)
        //   logger.debug('data.content = ' + data.content)
        logger.debug('writeFile  = ' + context.filename)
        await writeFile(data, context.filename)
        //  logger.debug("sink destinationFile = " + this.destinationFile)
        // await writeFile(this.destinationFile, data);
        this.emit('message', data, context)
    }
}

export default FileWriter
