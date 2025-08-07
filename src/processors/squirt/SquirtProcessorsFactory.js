import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import SquirtReceiver from './SquirtReceiver.js'
/*
   a ref to this should go in `src/engine/AbstractProcessorFactory.js`
*/


// import OtherProcessor from './SquirtReceiverProcessor.js'

class SquirtReceiverProcessorsFactory {

    static createProcessor(type, config) {

        // note this isn't the same as ===
        if (type.equals(ns.trn.SquirtReceiver)) {
            return new SquirtReceiver(config)
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
export default SquirtReceiverProcessorsFactory