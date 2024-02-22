import logger from '../utils/Logger.js'

class ProcessService extends Service {
    constructor() {
        super('process');
    }

    async execute() {
        // Process data
    }

    process(input) {
        return "Process interface called, oops."
    }
}

export default ProcessService