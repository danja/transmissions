import logger from '../../utils/Logger.js'
import Service from '../base/Service.js'

class WhiteboardToMessage extends Service {

    constructor(config) {
        super(config);
    }
    async execute(message) {

        logger.log('WhiteboardToMessage at (' + message.tags + ') ' + this.getTag())

        const originalArray = this.config.whiteboard
        //  message.whiteboard 
        message = Object.keys(originalArray).reduce((acc, key) => {
            const value = originalArray[key];
            if (value !== undefined && value !== null) {
                Object.keys(value).forEach((prop) => {
                    if (!acc[prop]) {
                        acc[prop] = [];
                    }
                    acc[prop].push(value[prop]);
                });
            }
            return acc;
        }, {});

        this.emit('message', message)
    }
}

export default WhiteboardToMessage
