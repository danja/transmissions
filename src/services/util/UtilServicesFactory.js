import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import ShowDataService from './ShowDataService.js'



class UtilServicesFactory {
    static createService(type, config) {
        logger.debug("ServiceFactory.createService : " + type.value)

        if (type.equals(ns.t.ShowDataService)) {
            return new ShowDataService(config)
        }
        return false
        //  throw new Error("Unknown service type: " + type.value)
    }
}

export default UtilServicesFactory