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

        // logger.log("FS config = " + Reveal.asMarkdown(dataset) + "\n\n" + dataset)

        const poi = grapoi({ dataset })

        for (const q of poi.out(ns.rdf.type, ns.fs.Mapping).quads()) {
            logger.log("AAAA")
            logger.log("q.subject " + q.subject.value)
            const mappingTerm = q.subject
            const mappingPoi = grapoi({ dataset, mappingTerm })
            //    logger.reveal(q)
            for (const p of mappingPoi.out(ns.fs.hasPath)) {
                logger.log("BBBB")
                // logger.log("P " + p.value)
                // logger.reveal(p)
                //  logger.log("p.out(ns.t.inputPath) " + p.out(ns.t.inputPath))
                const iq = mappingPoi.out(ns.t.inputPath)
                //   logger.log("mappingPoi.out(ns.t.inputPath) " + mappingPoi.out(ns.t.inputPath).quads())
                logger.log("iq.subject.value " + iq.subject.value + "  iq.object.value  " + iq.object.value)
                if (p.value === ns.t.inputPath.value) {

                    logger.log("pin " + p.value)
                }

            }

            /*
            const nationalities = house
                .out(ns.schema.knows)
                .out(ns.schema.nationality)
                .distinct()

            console.log('nationalities of all known people:')

            for (const value of nationalities.values) {
                console.log(`\t${value}`)
            }
*/
            /*
            if (q.object.equals(ns.fs.Mapping)) { // 
                const mappingPoi = rdf.grapoi({ dataset, term: q.subject })
                logger.log("mappingPoi = " + mappingPoi)
                this.extractPaths(mappingPoi)
                break
            }
            */

        }

    }

    extractPaths(mappingPoi) {
        logger.log("\n*** Extracting Paths ***")
        const i = mappingPoi.out(ns.fs.hasPath).out(ns.fs.input)
        for (const q of i) {
            logger.log("**** term.value = " + q)
        }

        /*
            for(const q of mappingPoi.out(ns.fs.hasPath).quads()) {
            logger.log("**** term.value = " + q.object.value)
            logger.log("**** ns.t.inputPath = " + ns.t.inputPath.value)
            switch (q.object.value) {
                case ns.t.inputPath.value:
                    //   this.inputPath = term.value
                    logger.log("ns.fs.input = ")
                    break
                case "output":
                    this.outputPath = term.value
                    break
            }
        }
        */
    }
}

export default FileSource




