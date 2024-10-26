import Processor from './Processor.js'

class SinkProcessor extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        // Consume data
    }
}

export default SinkProcessor 