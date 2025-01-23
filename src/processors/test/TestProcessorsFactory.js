import ns from '../../utils/ns.js'

import TestConfig from './TestConfig.js'

class TestProcessorsFactory {
    static createProcessor(type, config) {

        if (type.equals(ns.trn.TestConfig)) {
            return new TestConfig(config)
        }
        return false
    }
}

export default TestProcessorsFactory