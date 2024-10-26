import Processor from './Processor.js'

class SourceProcessor extends Processor {
    constructor(config) {
        super(config);
    }

    /*
    async process(message) {
        logger.log('in SourceProcessor, data = ' + data)
        return data
    }
    */
}

export default SourceProcessor