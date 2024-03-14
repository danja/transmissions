import logger from '../utils/Logger.js'
import ns from '../utils/ns.js'

import StringSource from '../services/test/StringSource.js'
import StringSink from '../services/test/StringSink.js'
import AppendProcess from '../services/test/AppendProcess.js'
import FileSource from '../services/test/FileSource.js'
import FileSink from '../services/test/FileSink.js'
//
import DirWalker from '../services/fs/DirWalker.js'

class ServiceFactory {
    static createService(type, config) {
        logger.debug("ServiceFactory.createService : " + type.value)

        // for e2e tests
        if (type.equals(ns.t.StringSource)) {
            return new StringSource(config)
        }
        if (type.equals(ns.t.StringSink)) {
            return new StringSink(config)
        }
        if (type.equals(ns.t.AppendProcess)) {
            return new AppendProcess(config)
        }
        if (type.equals(ns.t.FileSource)) {
            return new FileSource(config)
        }
        if (type.equals(ns.t.FileSink)) {
            return new FileSink(config)
        }
        // 
        if (type.equals(ns.t.DirWalker)) {
            return new DirWalker(config)
        }
        throw new Error("Unknown service type: " + type.value)
    }
}

export default ServiceFactory