import Service from './Service.js'

class SourceService extends Service {
    constructor(config) {
        super(config);
    }

    async execute(data, context) {
        return data
    }
}

export default SourceService