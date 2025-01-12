import ns from '../../utils/ns.js'
import DatasetReader from './DatasetReader.js'
import ConfigMap from './ConfigMap.js'
import RDFConfig from './RDFConfig.js'

class RDFProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.DatasetReader)) {
            return new DatasetReader(config)
        }
        if (type.equals(ns.trn.ConfigMap)) {
            return new ConfigMap(config)
        }
        if (type.equals(ns.trn.RDFConfig)) {
            return new RDFConfig(config)
        }
        return false
    }
}

export default RDFProcessorsFactory