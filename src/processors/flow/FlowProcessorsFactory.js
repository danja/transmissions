import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import ForEach from './ForEach.js'
import Ping from './Ping.js'

class FlowProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.t.ForEach)) {
            logger.debug('FlowProcessorsFactory: Creating ForEach processor')
            return new ForEach(config)
        }
        if (type.equals(ns.t.Ping)) {
            logger.debug('FlowProcessorsFactory: Creating Ping processor')
            return new Ping(config)
        }
        //    logger.debug('FlowProcessorsFactory: Unknown processor type')
        return false
    }
}

export default FlowProcessorsFactory