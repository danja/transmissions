import Service from './Service.js'

class SinkService extends Service {
    constructor(config) {
        super(config)
    }

    async execute(data, context) {
        // Consume data
    }
}

export default SinkService 