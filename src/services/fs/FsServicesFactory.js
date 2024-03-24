import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import DirWalker from './DirWalker.js'
import FileReader from './FileReader.js'
import FileWriter from './FileWriter.js'


class FsServicesFactory {
    static createService(type, config) {
        logger.debug("ServiceFactory.createService : " + type.value)

        if (type.equals(ns.t.DirWalker)) {
            return new DirWalker(config)
        }
        if (type.equals(ns.t.FileReader)) {
            return new FileReader(config)
        }
        if (type.equals(ns.t.FileWriter)) {
            return new FileWriter(config)

            return false
            //  throw new Error("Unknown service type: " + type.value)
        }
    }
}

export default FsServicesFactory