import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import { fromFile, toFile } from 'rdf-utils-fs'
import ns from './ns.js'
import logger from './Logger.js'

// probably already exist - ask Bergi

class GrapoiHelpers {

    // file utils
    static async readDataset(filename) {
        const stream = fromFile(filename)
        const dataset = await rdf.dataset().import(stream)
        return dataset
    }

    static async writeDataset(dataset, filename) {
        await toFile(dataset.toStream(), filename)
    }

    // follows chain in rdf:List
    static listToArray(dataset, term, property) {
        const poi = rdf.grapoi({ dataset: dataset, term: term })
        const first = poi.out(property).term
        let p = rdf.grapoi({ dataset, term: first })
        let object = p.out(ns.rdf.first).term
        const result = [object]

        while (true) {
            let restHead = p.out(ns.rdf.rest).term
            let p2 = rdf.grapoi({ dataset, term: restHead })
            let object = p2.out(ns.rdf.first).term

            if (restHead.equals(ns.rdf.nil)) break
            result.push(object)
            p = rdf.grapoi({ dataset, term: restHead })
        }
        return result
    }



    // unused & untested
    // [subjects] predicate ->  [objects]
    static listObjects(dataset, subjectList, predicate) {
        const objects = []
        for (const subject of subjectList) {
            logger.log("subject = " + subject.value)
            let p = rdf.grapoi({ dataset, term: subject })
            let object = p.out(predicate).term
            logger.log("object = " + object.value)
            objects.push(object)
        }
        return objects
    }
}
export default GrapoiHelpers