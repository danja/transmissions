// src/processors/system/SystemProcessorsFactory.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import EnvLoader from './EnvLoader.js'
import EndpointsGenerator from './EndpointsGenerator.js'



class SystemsProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.EnvLoader)) {
            return new EnvLoader(config)
        }
        if (type.equals(ns.trn.EndpointsGenerator)) {
            return new EndpointsGenerator(config)
        }
        return false
    }
}
export default SystemsProcessorsFactory
