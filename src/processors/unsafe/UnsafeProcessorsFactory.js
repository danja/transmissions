// import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import RunCommand from './RunCommand.js'


class UnsafeProcessorsFactory {
    static createProcessor(type, config) {

        if (type.equals(ns.trn.RunCommand)) {
            return new RunCommand(config)
        }

        return false
    }
}
export default UnsafeProcessorsFactory