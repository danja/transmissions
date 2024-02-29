import grapoi from 'grapoi'
import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'
import ns from '../utils/ns.js'
import SourceService from '../mill/SourceService.js';

class StringSource extends SourceService {

    execute() {
        logger.log("SS config = " + Reveal.asMarkdown(this.config) + "\n\n" + this.config)

        const dataset = this.config
        //   logger.log("this.config = " + this.config)
        const poi = grapoi({ dataset })
        //   const q = poi.out(ns.dc.title).quads()
        //  logger.log("term = " + term.value)
        let s = ""

        for (const q of poi.out(ns.dc.title).quads()) {

            s = q.object.value
            logger.log("s = " + s)
        }
        return s
    }
}

export default StringSource




