class SourceService extends Service {
    constructor() {
        super('source');
    }

    async execute(data, config) {
        // Generate or fetch data
    }

    read(sourceID) {
        return "Source interface called, oops."
    }
}

export default SourceService