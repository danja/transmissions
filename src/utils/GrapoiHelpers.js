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
        logger.debug(`GrapoiHelpers.listToArray, term = ${term ? term.value : 'undefined'}, property = ${property ? property.value : 'undefined'}`)

        if (!term || !property) {
            logger.warn('Missing term or property in listToArray')
            return []
        }

        try {
            const poi = rdf.grapoi({ dataset: dataset, term: term })
            const first = poi.out(property).term

            if (!first) {
                logger.debug(`No values found for property ${property.value}`)
                return []
            }

            logger.debug(`First term in list: ${first.value}`)

            let p = rdf.grapoi({ dataset, term: first })
            let object = p.out(ns.rdf.first).term

            if (!object) {
                logger.debug('No rdf:first object found')
                return []
            }

            logger.debug(`First object: ${object.value}`)
            const result = [object]

            while (true) {
                let restHead = p.out(ns.rdf.rest).term
                if (!restHead) {
                    logger.debug('No rdf:rest found, ending list traversal')
                    break
                }

                logger.debug(`Rest head: ${restHead.value}`)
                if (restHead.equals(ns.rdf.nil)) {
                    logger.debug('Reached rdf:nil, ending list traversal')
                    break
                }

                let p2 = rdf.grapoi({ dataset, term: restHead })
                let nextObject = p2.out(ns.rdf.first).term

                if (!nextObject) {
                    logger.debug('No next object found, ending list traversal')
                    break
                }

                logger.debug(`Next object: ${nextObject.value}`)
                result.push(nextObject)
                p = p2
            }

            logger.debug(`Found ${result.length} items in list`)
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