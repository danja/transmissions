import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import DirWalker from './DirWalker.js'
import FileReader from './FileReader.js'
import FileWriter from './FileWriter.js'
import FileCopy from './FileCopy.js'
import FileRemove from './FileRemove.js'

class FsProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.t.DirWalker)) {
            return new DirWalker(config)
        }
        if (type.equals(ns.t.FileReader)) {
            return new FileReader(config)
        }
        if (type.equals(ns.t.FileWriter)) {
            return new FileWriter(config)
        }
        if (type.equals(ns.t.FileCopy)) {
            return new FileCopy(config)
        }
        if (type.equals(ns.t.FileRemove)) {
            return new FileRemove(config)
        }
        return false
    }
}

export default FsProcessorsFactory