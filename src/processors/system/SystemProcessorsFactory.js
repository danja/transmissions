import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import HttpGet from './HttpGet.js'



class SystemsProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.t.EnvLoader)) {
            return new EnvLoader(config)
        }
        return false
    }
}
export default SystemsProcessorsFactory