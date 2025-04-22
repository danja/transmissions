import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import MermaidRenderer from './MermaidRenderer.js'
/*
   a ref to this should go in `src/processors/base/AbstractProcessorFactory.js`
*/



class MediaProcessorsFactory {

    static createProcessor(type, config) {

        // note this isn't the same as ===
        if (type.equals(ns.trn.MermaidRenderer)) {
            return new MermaidRenderer(config)
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
export default MediaProcessorsFactory