import logger from '../utils/Logger.js'
import fs from "node:fs"
import SinkService from '../mill/SinkService.js';

class FileSink extends SinkService {

    constructor() {
        super('FileSink')
        //  logger.log('FileSink')
    }

    execute(data) {
        const filename = "erwerwer"
        fs.writeFileSync(filename, data)
    }
}

export default FileSink
