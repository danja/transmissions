import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import HttpGet from './HttpGet.js'



class ProtocolsServicesFactory {
    static createService(type, config) {
        logger.debug("ProtocolsServicesFactory.createService : " + type.value)

        if (type.equals(ns.t.HttpGet)) {
            return new HttpGet(config)
        }

        return false
    }
}

export default ProtocolsServicesFactory