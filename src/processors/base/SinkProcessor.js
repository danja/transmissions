import Processor from './Processor.js'

class SinkProcessor extends Processor {
    constructor(config) {
        super(config)
    }

    async execute(message) {
        // Consume data
    }
}

export default SinkProcessor 