// import fs from "node:fs"
import { Sink } from './Sink.js';

export class StringSink extends Sink {
    //  constructor(sourceID) {
    //  this.sourceID = sourceID;
    // }

    write(sinkID, data) {
        console.log(data)
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
