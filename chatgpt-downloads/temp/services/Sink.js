import { ServiceBase } from './ServiceBase.js'

export class Sink extends ServiceBase {
    //  constructor(sourceID) {
    //  this.sourceID = sourceID;
    // }

    write(sinkID, data) {
        console.log("Sink interface called, oops.")
    }
}
