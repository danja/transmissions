import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import LineReader from './LineReader.js'
import StringFilter from './StringFilter.js'
import StringMerger from './StringMerger.js'

class TextServicesFactory {
    static createService(type, config) {
        logger.debug("TextServicesFactory.createService : " + type.value)

        if (type.equals(ns.t.LineReader)) {
            return new LineReader(config)
        }

        if (type.equals(ns.t.StringFilter)) {
            return new StringFilter(config)
        }

        if (type.equals(ns.t.StringMerger)) {
            return new StringMerger(config)
        }

        return false
    }
}

export default TextServicesFactory