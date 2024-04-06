import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import NOP from './NOP.js'
import ShowMessage from './ShowMessage.js'
import Halt from './Halt.js'


class UtilServicesFactory {
    static createService(type, config) {
        logger.debug("ServiceFactory.createService : " + type.value)
        if (type.equals(ns.t.NOP)) {
            return new NOP(config)
        }
        if (type.equals(ns.t.ShowMessage)) {
            return new ShowMessage(config)
        }
        if (type.equals(ns.t.Halt)) {
            return new Halt(config)
        }

        return false
        //  throw new Error("Unknown service type: " + type.value)
    }
}

export default UtilServicesFactory