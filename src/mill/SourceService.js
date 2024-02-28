import Service from './Service.js'

class SourceService extends Service {
    constructor() {
        super('source');
    }

    async execute(data, config) {
        // Generate or fetch data
    }
}

export default SourceService