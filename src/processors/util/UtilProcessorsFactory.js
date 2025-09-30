import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import ShowMessage from './ShowMessage.js'
import ShowTransmission from './ShowTransmission.js'
import CaptureAll from './CaptureAll.js'
import ShowConfig from './ShowConfig.js'
import WhiteboardToMessage from './WhiteboardToMessage.js'
import SetMessage from './SetMessage.js'
import ShowSettings from './ShowSettings.js'
import SetField from './SetField.js'
import ResourceMinter from './ResourceMinter.js'
import URLNormalizer from './URLNormalizer.js'

class UtilProcessorsFactory {
    static createProcessor(type, config) {

        if (type.equals(ns.trn.ShowMessage)) {
            return new ShowMessage(config)
        }
        if (type.equals(ns.trn.ShowTransmission)) {
            return new ShowTransmission(config)
        }
        if (type.equals(ns.trn.CaptureAll)) {
            return new CaptureAll(config)
        }
        if (type.equals(ns.trn.ShowConfig)) {
            return new ShowConfig(config)
        }
        if (type.equals(ns.trn.WhiteboardToMessage)) {
            return new WhiteboardToMessage(config)
        }
        if (type.equals(ns.trn.SetMessage)) {
            return new SetMessage(config)
        }
        if (type.equals(ns.trn.ShowSettings)) {
            return new ShowSettings(config)
        }
        if (type.equals(ns.trn.SetField)) {
            return new SetField(config)
        }
        if (type.equals(ns.trn.ResourceMinter)) {
            return new ResourceMinter(config)
        }
        if (type.equals(ns.trn.URLNormalizer)) {
            return new URLNormalizer(config)
        }
        return false
    }
}
export default UtilProcessorsFactory