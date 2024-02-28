import Service from './Service.js'

class SinkService extends Service {
    constructor() {
        super('sink')
    }

    async execute(data, config) {
        // Consume data
    }

    write(sinkID, data) {
        console.log("Sink interface called, oops.")
    }
}

export default SinkService 