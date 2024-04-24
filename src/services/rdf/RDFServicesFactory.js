import ns from '../../utils/ns.js'
import ContextReader from './ContextReader.js'
import ConfigMap from './ConfigMap.js'

class RDFServicesFactory {
    static createService(type, config) {
        if (type.equals(ns.t.ContextReader)) {
            return new ContextReader(config)
        }
        if (type.equals(ns.t.ConfigMap)) {
            return new ConfigMap(config)
        }
        return false
    }
}

export default RDFServicesFactory