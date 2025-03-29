// import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import BashCommand from './BashCommand.js'


class UnsafeProcessorsFactory {
    static createProcessor(type, config) {

        if (type.equals(ns.trn.BashCommand)) {
            return new BashCommand(config)
        }

        return false
    }
}
export default UnsafeProcessorsFactory