import * as fs from 'fs'

import { Injectable } from '../di/Injectable.js';


export class Sink extends Injectable {
    //  constructor(sourceID) {
    //  this.sourceID = sourceID;
    // }

    write(sinkID, data) {
        return this.writeFile(sinkID, data)
    }

    writeFile(filename, text) {
        fs.writeFileSync(filename, text)
    }
}
