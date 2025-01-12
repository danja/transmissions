//import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import HttpServer from './HttpServer.js'
import HttpClient from './HttpClient.js'
import HttpProxy from './HttpProxy.js'

class HttpProcessorsFactory {
    static createProcessor(type, config) {

        if (type.equals(ns.trn.HttpServer)) {
            return new HttpServer(config)
        }
        if (type.equals(ns.trn.HttpClient)) {
            return new HttpClient(config)
        }
        if (type.equals(ns.trn.HttpProxy)) {
            return new HttpProxy(config)
        }

        return false
    }
}
export default HttpProcessorsFactory