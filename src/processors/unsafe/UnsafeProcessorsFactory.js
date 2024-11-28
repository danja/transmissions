import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import ProcessorTemplate from './RunCommand.js'

// ref needed in transmissions/src/processors/base/AbstractProcessorFactory.js

class ProcessorsFactoryTemplate {
    static createProcessor(type, config) {

        if (type.equals(ns.t.ProcessorTemplate)) {
            return new ProcessorTemplate(config)
        }

        return false
    }
}
export default ProcessorsFactoryTemplate