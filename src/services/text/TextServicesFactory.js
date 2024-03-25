import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import LineReader from './LineReader.js'


class TextServicesFactory {
    static createService(type, config) {
        logger.debug("ServiceFactory.createService : " + type.value)

        if (type.equals(ns.t.LineReader)) {
            return new LineReader(config)
        }

        return false
        //  throw new Error("Unknown service type: " + type.value)
    }
}

export default TextServicesFactory