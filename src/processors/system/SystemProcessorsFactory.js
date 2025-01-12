import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import EnvLoader from './EnvLoader.js'



class SystemsProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.EnvLoader)) {
            return new EnvLoader(config)
        }
        return false
    }
}
export default SystemsProcessorsFactory