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

    //  t:FilePipelineMap a trm:DataMap ;
    //  trm:sourceFile "data/input.txt" ;
    //  trm:destinationFile "data/output.txt" .

    constructor(config) {
        super(config)
        console.log("COFIG = " + config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        // const map = poi.out(ns.rdf.type, ns.trm.DataMap).term
        // const cwd = process.cwd() + '/../../' // move!
        this.sourceFile = poi.out(ns.trm.sourceFile).value
    }

    async execute(data, context) {
        logger.debug("sourceFile = " + this.sourceFile)
        //  logger.debug("FileSource process.cwd() = " + process.cwd())
        try {
            const sf = footpath.resolve(import.meta.url, '../../../', this.sourceFile)

            const contents = await readFile(sf, { encoding: 'utf8' })
            logger.debug(contents)
            this.emit('data', contents, context)
        } catch (err) {
            logger.error("FileSource.execute error : " + err.message)
        }
    }
}

export default FileSource




