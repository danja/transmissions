import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import MetadataExtractor from './MetadataExtractor.js'

class MarkupServicesFactory {
    static createService(type, config) {
        logger.debug("ServiceFactory.createService : " + type.value)

        if (type.equals(ns.t.MetadataExtractor)) {
            return new MetadataExtractor(config)
        }

        return false
        //  throw new Error("Unknown service type: " + type.value)
    }
}

export default MarkupServicesFactory