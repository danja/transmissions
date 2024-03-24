import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
//const { readFile } = require('node:fs/promises');
//const { resolve } = require('node:path');

import rdf from 'rdf-ext'
import { Reveal } from '../../utils/Reveal.js'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import logger from '../../utils/Logger.js'
import SourceService from '../../mill/SourceService.js'

class FileReader extends SourceService {

    constructor(config) {
        super(config)
        const dataset = this.config
        const poi = grapoi({ dataset })
        // const map = poi.out(ns.rdf.type, ns.trm.DataMap).term
        const cwd = process.cwd() + '/../' // move!
        this.sourceFile = cwd + poi.out(ns.trm.sourceFile).value
    }

    async execute(filename) {
        logger.debug("FileReader sourceFile = " + filename)
        //  logger.debug("FileSource process.cwd() = " + process.cwd())
        try {
            // const filePath = resolve(this.sourceFile) // needed?

            const contents = await readFile(filename)
            // const contents = await readFile(this.sourceFile, { encoding: 'utf8' })

            logger.debug(contents)
            const data = { filename: filename, contents: contents }
            this.emit('data', data)
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

export default FileReader