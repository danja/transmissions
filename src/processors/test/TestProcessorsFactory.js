import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import StringSource from './StringSource.js'
import StringSink from './StringSink.js'
import AppendProcess from './AppendProcess.js'
import FileSource from './FileSource.js'
import FileSink from './FileSink.js'



class TestProcessorsFactory {
    static createProcessor(type, config) {

        // for e2e tests
        // String
        if (type.equals(ns.trn.StringSource)) {
            return new StringSource(config)
        }
        if (type.equals(ns.trn.StringSink)) {
            return new StringSink(config)
        }
        if (type.equals(ns.trn.AppendProcess)) {
            return new AppendProcess(config)
        }

        // simple file
        if (type.equals(ns.trn.FileSource)) {
            return new FileSource(config)
        }
        if (type.equals(ns.trn.FileSink)) {
            return new FileSink(config)
        }

        return false
    }
}

export default TestProcessorsFactory