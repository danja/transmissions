
import { readFile } from 'node:fs/promises'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import SourceService from '../base/SourceService.js'

class FileReader extends SourceService {

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        // const cwd = process.cwd() + '/../' // move!
        this.sourceFile = poi.out(ns.trm.sourceFile).value
    }

    async execute(filename) {
        logger.debug("FileReader sourceFile = " + filename)
        if (filename === 'internal') {
            filename = this.sourceFile
        }
        const f = footpath.resolve(import.meta.url, '../../../', filename)
        try {
            const content = await readFile(f)
            //    logger.debug(content.toString())
            const data = { filename: filename, content: content }
            this.emit('data', data)
        } catch (err) {
            logger.error("FileReader.execute error : " + err.message)
        }
    }
}

export default FileReader