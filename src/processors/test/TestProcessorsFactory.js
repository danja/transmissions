import ns from '../../utils/ns.js'

import TestSetting from './TestSetting.js'
import TestSettings from './TestSettings.js'


class TestProcessorsFactory {
    static createProcessor(type, config) {

        if (type.equals(ns.trn.TestSettings)) {
            return new TestSettings(config)
        }
        if (type.equals(ns.trn.TestSetting)) {
            return new TestSetting(config)
        }
        return false
    }
}

export default TestProcessorsFactory