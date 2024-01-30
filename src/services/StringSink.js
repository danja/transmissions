import logger from '../utils/Logger.js'
// import fs from "node:fs"
import { Sink } from './Sink.js';

export class StringSink extends Sink {
    //  constructor(sourceID) {
    //  this.sourceID = sourceID;
    // }

    write(sinkID, data) {
        logger.log("StringSink.write : " + sinkID + " : " + data)
    }

    /*   
    write(sinkID, data) {
        return this.writeFile(sinkID, data)
    }

    writeFile(filename, text) {
        fs.writeFileSync(filename, text)
    }
    */
}
