import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import DirWalker from './DirWalker.js'
import FileReader from './FileReader.js'
import FileWriter from './FileWriter.js'
import FileCopy from './FileCopy.js'
import FileRemove from './FileRemove.js'
import FilenameMapper from './FilenameMapper.js'
import PathOps from './PathOps.js'
import FileFilter from './FileFilter.js'

class FsProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.DirWalker)) {
            return new DirWalker(config)
        }
        if (type.equals(ns.trn.FileReader)) {
            return new FileReader(config)
        }
        if (type.equals(ns.trn.FileWriter)) {
            return new FileWriter(config)
        }
        if (type.equals(ns.trn.FileCopy)) {
            return new FileCopy(config)
        }
        if (type.equals(ns.trn.FileRemove)) {
            return new FileRemove(config)
        }
        if (type.equals(ns.trn.FilenameMapper)) {
            return new FilenameMapper(config)
        }
        if (type.equals(ns.trn.PathOps)) {
            return new PathOps(config)
        }
        if (type.equals(ns.trn.FileFilter)) {
            return new FileFilter(config)
        }
        return false
    }
}

export default FsProcessorsFactory