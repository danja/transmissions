import { Injectable } from '../di/Injectable.js';

export class Sink extends Injectable {
    //  constructor(sourceID) {
    //  this.sourceID = sourceID;
    // }

    write(sinkID, data) {
        console.log("Sink interface called, oops.")
    }
}
