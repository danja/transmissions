import Service from './Service.js'

class SinkService extends Service {
    constructor(config) {
        super(config)
    }

    async execute(message) {
        // Consume data
    }
}

export default SinkService 