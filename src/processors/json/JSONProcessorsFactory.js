import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import JSONWalker from './JSONWalker.js'
import Restructure from './Restructure.js'
import ValueConcat from './ValueConcat.js'
import Blanker from './Blanker.js'

class JSONProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.Restructure)) {
            return new Restructure(config)
        }
        if (type.equals(ns.trn.JSONWalker)) {
            return new JSONWalker(config)
        }
        if (type.equals(ns.trn.ValueConcat)) {
            return new ValueConcat(config)
        }
        if (type.equals(ns.trn.Blanker)) {
            return new Blanker(config)
        }
        return false
    }

}
export default JSONProcessorsFactory