import path from 'path'
import { fileURLToPath } from 'url'

import { readFile } from 'node:fs/promises'


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
        const dataset = this.config
        const poi = grapoi({ dataset })
        // const map = poi.out(ns.rdf.type, ns.trm.DataMap).term
        // const cwd = process.cwd() + '/../../' // move!
        this.sourceFile = poi.out(ns.trm.sourceFile).value
    }

    async execute(data) {
        logger.debug("sourceFile = " + this.sourceFile)
        //  logger.debug("FileSource process.cwd() = " + process.cwd())
        try {
            const __filename = fileURLToPath(import.meta.url);
            logger.debug("__filename = " + __filename)
            const __dirname = path.dirname(__filename)
            logger.debug("__dirname = " + __dirname)
            const rootDir = path.resolve(__dirname, '../../../') //
            logger.debug("rootDir = " + rootDir)
            const filePath = path.join(rootDir, this.sourceFile);
            logger.debug("filePath = " + filePath)
            const contents = await readFile(filePath, { encoding: 'utf8' })
            //     const contents = await readFile(this.sourceFile, { encoding: 'utf8' })
            logger.debug(contents)
            this.emit('data', contents)
            //  return contents
        } catch (err) {
            logger.error("FileSource.execute error : " + err.message)
        }
        /*
      fs.readFileSync(this.sourceFile, 'utf8', (err, data) => {
          logger.log("read =    " + data)
          return data
      })
      */
    }
}

export default FileSource




