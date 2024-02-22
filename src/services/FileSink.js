import logger from '../utils/Logger.js'
import fs from "node:fs"
import Sink from './Sink.js';

class FileSink extends Sink {

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
