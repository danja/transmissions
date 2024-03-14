import fs from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
//const { readFile } = require('node:fs/promises');
//const { resolve } = require('node:path');

import rdf from 'rdf-ext'
import { Reveal } from '../utils/Reveal.js'
import grapoi from 'grapoi'
import ns from '../utils/ns.js'

import logger from '../utils/Logger.js'
import SourceService from '../mill/SourceService.js';

class FileSource extends SourceService {

    //  t:FilePipelineMap a trm:DataMap ;
    //  trm:sourceFile "data/input.txt" ;
    //  trm:destinationFile "data/output.txt" .

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        // const map = poi.out(ns.rdf.type, ns.trm.DataMap).term
        const cwd = process.cwd() + '/../' // move!
        this.sourceFile = cwd + poi.out(ns.trm.sourceFile).value
    }

    async execute(data) {
        logger.debug("sourceFile = " + this.sourceFile)
        //  logger.debug("FileSource process.cwd() = " + process.cwd())
        try {
            const filePath = resolve(this.sourceFile)
            //  const contents = await readFile(filePath, { encoding: 'utf8' })
            const contents = await readFile(this.sourceFile, { encoding: 'utf8' })
            logger.debug(contents)
            this.emit('data', contents)
            //  return contents
        } catch (err) {
            console.error(err.message);
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




