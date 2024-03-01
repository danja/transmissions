import rdf from 'rdf-ext'
import { Reveal } from '../utils/Reveal.js'
import grapoi from 'grapoi'
import ns from '../utils/ns.js'

import logger from '../utils/Logger.js'
import SourceService from '../mill/SourceService.js';

class FileSource extends SourceService {

    async execute(data) {
        // ignoring data 

        const dataset = this.config

        logger.log("FS config = " + Reveal.asMarkdown(dataset) + "\n\n" + dataset)

        const poi = grapoi({ dataset })

        for (const q of poi.out(ns.rdf.type).quads()) {
            if (q.object.equals(ns.fs.Mapping)) { // 
                const mappingPoi = rdf.grapoi({ dataset, term: q.subject })
                logger.log("mappingPoi = " + mappingPoi)
                this.extractPaths(mappingPoi)
                break
            }
        }

    }

    extractPaths(mappingPoi) {
        for (const term of mappingPoi.out(ns.fs.hasPath).terms) {
            logger.log(term.value)

        }
    }
}

export default FileSource




