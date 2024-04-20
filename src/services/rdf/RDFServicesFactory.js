import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import ContextReader from './ContextReader.js'


class RDFServicesFactory {
    static createService(type, config) {
        logger.debug("RDFServicesFactory.createService : " + type.value)

        if (type.equals(ns.t.ContextReader)) {
            return new ContextReader(config)
        }
        return false
    }
}

export default RDFServicesFactory