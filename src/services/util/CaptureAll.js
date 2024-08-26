import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class CaptureAll extends Service {




    constructor(config) {
        if (!config.whiteboard) {  // TODO refactor
            config.whiteboard = []
        }
        super(config)

        // Singleton
        if (CaptureAll.singleInstance) {
            return CaptureAll.singleInstance
        }
        CaptureAll.singleInstance = this;
    }


    async execute(message) {
        logger.log('CaptureAll at (' + message.tags + ') ' + this.getTag())
        this.config.whiteboard.push(message)
        this.emit('message', message)
    }


}

export default CaptureAll
