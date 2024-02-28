import Service from './Service.js'

class SinkService extends Service {
    constructor() {
        super('SinkService')
    }

    async execute(data, config) {
        // Consume data
    }
}

export default SinkService 