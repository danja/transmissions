import Processor from './Processor.js'

class SourceProcessor extends Processor {
    constructor(config) {
        super(config);
    }

    /*
    async execute(message) {
        logger.log('in SourceProcessor, data = ' + data)
        return data
    }
    */
}

export default SourceProcessor