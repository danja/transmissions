import logger from '../utils/Logger.js'
import ns from '../utils/ns.js'

// Import service groups
import TestServicesFactory from '../services/test/TestServicesFactory.js'
import FsServicesFactory from '../services/fs/FsServicesFactory.js'
import MarkupServicesFactory from '../services/markup/MarkupServicesFactory.js'
import UtilServicesFactory from '../services/util/UtilServicesFactory.js'
import TextServicesFactory from '../services/text/TextServicesFactory.js'
import ProtocolsServicesFactory from '../services/protocols/ProtocolsServicesFactory.js'
import RDFServicesFactory from '../services/rdf/RDFServicesFactory.js'

class AbstractServiceFactory {

    // looks until it finds
    // good enough for now 

    static createService(type, config) {
        logger.debug("ServiceFactory.createService : " + type.value)

        var service = TestServicesFactory.createService(type, config)
        if (service) return service

        var service = UtilServicesFactory.createService(type, config)
        if (service) return service

        service = FsServicesFactory.createService(type, config)
        if (service) return service

        service = MarkupServicesFactory.createService(type, config)
        if (service) return service

        service = TextServicesFactory.createService(type, config)
        if (service) return service

        service = ProtocolsServicesFactory.createService(type, config)
        if (service) return service

        service = RDFServicesFactory.createService(type, config)
        if (service) return service

        throw new Error("Unknown service type: " + type.value)
    }
}

export default AbstractServiceFactory