import { EventEmitter } from 'events'
import logger from '../utils/Logger.js'

class Connector extends EventEmitter {


    constructor(fromName, toName) {
        super();
        this.fromName = fromName
        this.toName = toName
    }

    connect(services) {
        let fromService = services[this.fromName]
        let toService = services[this.toName]

        fromService.on('message', (data, context = {}) => {
            logger.log("\nPipe running service : " + this.toName)
            // QQQ
            //   toService.execute(data, context)
            toService.receive(data, context)
        })
    }


}

export default Connector