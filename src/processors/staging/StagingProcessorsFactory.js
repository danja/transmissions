// TODO remove
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import MarkdownFormatter from './MarkdownFormatter.js'
import TurtleFormatter from './TurtleFormatter.js'

// ref needed in transmissions/src/engine/AbstractProcessorFactory.js


class StagingProcessorsFactory {
    static createProcessor(type, config) {

        if (type.equals(ns.trn.MarkdownFormatter)) {
            return new MarkdownFormatter(config)
        }
        if (type.equals(ns.trn.TurtleFormatter)) {
            return new TurtleFormatter(config)
        }
        return false
    }
}
export default StagingProcessorsFactory