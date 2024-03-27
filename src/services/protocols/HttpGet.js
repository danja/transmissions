import axios from 'axios'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class HttpGet extends ProcessService {

    constructor(config) {
        super(config)
        /*
        const dataset = this.config
        const poi = grapoi({ dataset })
        // const cwd = process.cwd() + '/../' // move!
        this.sourceFile = poi.out(ns.trm.sourceFile).value
        */
    }

    async execute(url, context) {
        try {
            const response = await axios.get(url);
            //  console.log(response);
            const filename = 'data/got.txt'
            const content = response.data
            const data = { filename: filename, content: content }
            this.emit('message', data, context)
        } catch (error) {
            // console.error(error);
        }
        /*
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
        */
    }
}

export default HttpGet