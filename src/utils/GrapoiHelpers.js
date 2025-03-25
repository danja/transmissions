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
        logger.trace(`GrapoiHelpers.listToArray, term = ${term ? term.value : 'undefined'}, property = ${property ? property.value : 'undefined'}`)

        if (!term || !property) {
            logger.warn('Missing term or property in listToArray')
            return []
        }

        try {
            const poi = rdf.grapoi({ dataset: dataset, term: term })
            const first = poi.out(property).term

            if (!first) {
                logger.trace(`No values found for property ${property.value}`)
                return []
            }

            logger.trace(`First term in list: ${first.value}`)

            let p = rdf.grapoi({ dataset, term: first })
            let object = p.out(ns.rdf.first).term

            if (!object) {
                logger.trace('No rdf:first object found')
                return []
            }

            logger.trace(`First object: ${object.value}`)
            const result = [object]

            while (true) {
                let restHead = p.out(ns.rdf.rest).term
                if (!restHead) {
                    logger.trace('No rdf:rest found, ending list traversal')
                    break
                }

                logger.trace(`Rest head: ${restHead.value}`)
                if (restHead.equals(ns.rdf.nil)) {
                    logger.trace('Reached rdf:nil, ending list traversal')
                    break
                }

                let p2 = rdf.grapoi({ dataset, term: restHead })
                let nextObject = p2.out(ns.rdf.first).term

                if (!nextObject) {
                    logger.trace('No next object found, ending list traversal')
                    break
                }

                logger.trace(`Next object: ${nextObject.value}`)
                result.push(nextObject)
                p = p2
            }

            logger.trace(`Found ${result.length} items in list`)
            return result
        } catch (error) {
            logger.error(`Error in listToArray: ${error.message}`)
            logger.error(error.stack)
            return []
        }
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