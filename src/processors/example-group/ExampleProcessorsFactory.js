import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import ExampleProcessor from './ExampleProcessor.js'
/*
   a ref to this should go in `src/processors/base/AbstractProcessorFactory.js`
*/


// import OtherProcessor from './ExampleProcessor.js'

class ExampleProcessorsFactory {

    static createProcessor(type, config) {

        if (type.equals(ns.trn.ExampleProcessor)) {
            return new ExampleProcessor(config)
        }

        /** Other processors in the group follow the same pattern

        if (type.equals(ns.trn.OtherProcessor)) {
            return new OtherProcessor(config)
        }
            ...
        */

        return false
    }
}
export default ExampleProcessorsFactory