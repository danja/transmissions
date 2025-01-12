import path from 'path'
import { fileURLToPath } from 'url'

import { readFile } from 'node:fs/promises'

import footpath from '../../utils/footpath.js'
import rdf from 'rdf-ext'

import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class FileSource extends Processor {

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        this.sourceFile = poi.out(ns.trn.sourceFile).value
    }

    // In FileSource.js
    async process(message) {
        try {
            const toRootDir = '../../../'
            const dataDir = toRootDir + message.dataDir
            const sf = footpath.resolve(import.meta.url, dataDir, this.sourceFile)
            logger.debug('FileSource file : ' + sf)
            const contents = await readFile(sf, { encoding: 'utf8' })
            logger.debug('FileSource data : ' + contents)
            return this.emit('message', { content: contents, ...message })
        } catch (err) {
            logger.error("FileSource.execute error : " + err.message)
        }
    }
}

export default FileSource




