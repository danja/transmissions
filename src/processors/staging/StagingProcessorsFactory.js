import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import Processors from './ProcessorTemplate.js'

// ref needed in transmissions/src/engine/AbstractProcessorFactory.js


class StagingProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.t.ProcessorTemplate)) {
            return new ProcessorTemplate(config)
        }
        return false
    }
}
export default StagingProcessorsFactory