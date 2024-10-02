import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'


import Processors from './ProcessorsTemplate.js'



class TemplateProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.t.ProcessorsTemplate)) {
            return new ProcessorsTemplate(config)
        }
        return false
    }
}
export default TemplateProcessorsFactory