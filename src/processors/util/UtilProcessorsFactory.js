import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import ShowMessage from './ShowMessage.js'
import ShowTransmission from './ShowTransmission.js'
import CaptureAll from './CaptureAll.js'
import ShowConfig from './ShowConfig.js'
import WhiteboardToMessage from './WhiteboardToMessage.js'
import SetMessage from './SetMessage.js'

class UtilProcessorsFactory {
    static createProcessor(type, config) {

        if (type.equals(ns.t.ShowMessage)) {
            return new ShowMessage(config)
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
    }
}
export default UtilProcessorsFactory