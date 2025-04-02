import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import SPARQLSelect from './SPARQLSelect.js'
import SPARQLUpdate from './SPARQLUpdate.js'

/**
 * @class SPARQLProcessorsFactory
 * @classdesc
 * **Factory for SPARQL Processors**
 *
 * Creates instances of SPARQL query and update processors.
 *
 */
class SPARQLProcessorsFactory {

    static createProcessor(type, config) {

        if (type.equals(ns.trn.SPARQLSelect)) {
            return new SPARQLSelect(config)
        }
        if (type.equals(ns.trn.SPARQLUpdate)) {
            return new SPARQLUpdate(config)
        }

        return false
    }
}
export default SPARQLProcessorsFactory