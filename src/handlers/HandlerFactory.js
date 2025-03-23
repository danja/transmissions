import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'

class HandlerFactory {

    static createHandler(type, config) {
        if (type.equals(ns.trn.ConfigSet)) {
            return new ForEach(config)
        }
    }
export default HandlerFactory
