import logger from '../utils/Logger.js'
import fs from "node:fs"
import SinkService from '../mill/SinkService.js';

class FileSink extends SinkService {

    constructor() {
        super('FileSink')
        //  logger.log('FileSink')
    }

    execute(data, config) {
    }

    write(sinkID, data) {
        logger.log("StringSink.write : " + sinkID + " : " + data)
    }


    write(sinkID, data) {
        return this.writeFile(sinkID, data)
    }

    writeFile(filename, text) {
        fs.writeFileSync(filename, text)
    }

}

export default FileSink
