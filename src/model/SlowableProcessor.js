import { EventEmitter } from 'events'
import Processor from './Processor.js'
import logger from '../utils/Logger.js'
import ns from '../utils/ns.js'
import SysUtils from '../utils/SysUtils.js'

class SlowableProcessor extends Processor {

    constructor(config) {
        super(config)
    }

    async preProcess(message) {
        const delay = super.getProperty(ns.trn.delay, '0') // 100mS is default if unspecified elsewhere
        logger.trace(`SPEEPIES`)
        await SysUtils.sleep(delay)
        return super.preProcess(message)
    }
}
export default SlowableProcessor
