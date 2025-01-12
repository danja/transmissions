import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import ForEach from './ForEach.js'
import Ping from './Ping.js'
import NOP from '../flow/NOP.js'
import DeadEnd from '../flow/DeadEnd.js'
import Halt from '../flow/Halt.js'
import Unfork from '../flow/Unfork.js'
import Fork from '../flow/Fork.js'

class FlowProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.trn.ForEach)) {
            logger.debug('FlowProcessorsFactory: Creating ForEach processor')
            return new ForEach(config)
        }
        if (type.equals(ns.trn.Ping)) {
            logger.debug('FlowProcessorsFactory: Creating Ping processor')
            return new Ping(config)
        }
        if (type.equals(ns.trn.NOP)) {
            return new NOP(config)
        }
        if (type.equals(ns.trn.DeadEnd)) {
            return new DeadEnd(config)
        }
        if (type.equals(ns.trn.Halt)) {
            return new Halt(config)
        }
        if (type.equals(ns.trn.Fork)) {
            return new Fork(config)
        }
        if (type.equals(ns.trn.Unfork)) {
            return new Unfork(config)
        }
        return false
    }
}

export default FlowProcessorsFactory