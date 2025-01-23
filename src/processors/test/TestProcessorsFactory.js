import ns from '../../utils/ns.js'

import TestSettings from './TestSettings.js'

class TestProcessorsFactory {
    static createProcessor(type, config) {

        if (type.equals(ns.trn.TestSettings)) {
            return new TestSettings(config)
        }
        return false
    }
}

export default TestProcessorsFactory