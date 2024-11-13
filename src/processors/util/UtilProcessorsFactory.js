import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import NOP from './NOP.js'
import DeadEnd from './DeadEnd.js'
import ShowMessage from './ShowMessage.js'
import Halt from './Halt.js'
import Restructure from '../json/Restructure.js'
import Unfork from './Unfork.js'
import Fork from './Fork.js'
import ShowTransmission from './ShowTransmission.js'
import CaptureAll from './CaptureAll.js'
import ShowConfig from './ShowConfig.js'
import WhiteboardToMessage from './WhiteboardToMessage.js'
import SetMessage from './SetMessage.js'

class UtilProcessorsFactory {
    static createProcessor(type, config) {
        if (type.equals(ns.t.NOP)) {
            return new NOP(config)
        }
        if (type.equals(ns.t.DeadEnd)) {
            return new DeadEnd(config)
        }
        if (type.equals(ns.t.ShowMessage)) {
            return new ShowMessage(config)
        }
        if (type.equals(ns.t.Halt)) {
            return new Halt(config)
        }
        if (type.equals(ns.t.Restructure)) {
            return new Restructure(config)
        }
        if (type.equals(ns.t.Fork)) {
            return new Fork(config)
        }
        if (type.equals(ns.t.Unfork)) {
            return new Unfork(config)
        }
        if (type.equals(ns.t.ShowTransmission)) {
            return new ShowTransmission(config)
        }
        if (type.equals(ns.t.CaptureAll)) {
            return new CaptureAll(config)
        }
        if (type.equals(ns.t.ShowConfig)) {
            return new ShowConfig(config)
        }
        if (type.equals(ns.t.WhiteboardToMessage)) {
            return new WhiteboardToMessage(config)
        }
        if (type.equals(ns.t.SetMessage)) {
            return new SetMessage(config)
        }

        return false
        //  throw new Error("Unknown processor type: " + type.value)
    }
}

export default UtilProcessorsFactory