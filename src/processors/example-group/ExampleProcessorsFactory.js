import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import Example from './Example.js'
/*
   a ref to this should go in `src/engine/AbstractProcessorFactory.js`
*/


// import OtherProcessor from './ExampleProcessor.js'

class ExampleProcessorsFactory {

    static createProcessor(type, config) {

        // note this isn't the same as ===
        if (type.equals(ns.trn.Example)) {
            return new Example(config)
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