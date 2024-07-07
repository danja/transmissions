import path from 'path'
import { fileURLToPath } from 'url'

import { readFile } from 'node:fs/promises'

import footpath from '../../utils/footpath.js'
import rdf from 'rdf-ext'

import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import logger from '../../utils/Logger.js'
import SourceService from '../base/SourceService.js'

class FileSource extends SourceService {

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        this.sourceFile = poi.out(ns.trm.sourceFile).value
    }

    async execute(context) {
        try {
            const toRootDir = '../../../'
            const dataDir = toRootDir + context.dataDir
            const sf = footpath.resolve(import.meta.url, dataDir, this.sourceFile)

            // const sf = path.join(__dirname, toRootDir, context.dataDir, filePath);

            logger.debug('FileSource file : ' + sf)

            const contents = await readFile(sf, { encoding: 'utf8' })
            logger.debug('FileSource data : ' + contents)
            this.emit('message', contents, context)
        } catch (err) {
            logger.error("FileSource.execute error : " + err.message)
        }
    }
}

export default FileSource




