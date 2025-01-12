import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import HttpGet from './HttpGet.js'



class ProtocolsProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.HttpGet)) {
            return new HttpGet(config)
        }

        return false
    }
}

export default ProtocolsProcessorsFactory