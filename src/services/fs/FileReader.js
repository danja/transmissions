
import { readFile } from 'node:fs/promises'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import SourceService from '../base/SourceService.js'

class FileReader extends SourceService {

    constructor(config) {
        super(config)
    }

    resolveConfig() {

        const dataset = this.config
        const poi = grapoi({ dataset, term: this.configKey }).in()

        //        logger.log("ALL POI = ")
        //        logger.poi(poi)
        //   const house = grapoi({ dataset, factory: rdf, term: this.configKey }).in().trim()

        this.sourceFile = poi.out(ns.trm.value).value
        logger.log("FileReader.sourceFile = " + this.sourceFile)

        /*
        const s = poi.node(ns.t('llSourceMap'))
            .out(ns.trm('value'))
            .value

        console.log(s);
*/

    }

    async execute(data, context) {
        this.resolveConfig()
        process.exit()
        logger.log("MK KEY " + this.configKey)
        var filename = context.sourceFile

        if (!filename || filename === 'internal') {
            filename = this.sourceFile
        }
        logger.debug("FileReader sourceFile = " + filename)
        const f = footpath.resolve(import.meta.url, '../../../', filename)
        try {
            const content = await readFile(f)
            //    logger.debug(content.toString())
            //  const context = { filename: filename }
            this.emit('message', content, context)
        } catch (err) {
            logger.error("FileReader.execute error : " + err.message)
        }
    }
}

export default FileReader