import ns from '../../utils/ns.js'
import DatasetReader from './DatasetReader.js'
import ConfigMap from './ConfigMap.js'

class RDFProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.t.DatasetReader)) {
            return new DatasetReader(config)
        }
        if (type.equals(ns.t.ConfigMap)) {
            return new ConfigMap(config)
        }
        return false
    }
}

export default RDFProcessorsFactory