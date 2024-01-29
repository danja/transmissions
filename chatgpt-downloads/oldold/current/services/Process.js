import { Injectable } from '../di/Injectable.js';

export class Process extends Injectable {
    //  constructor(sourceID) {
    //  this.sourceID = sourceID;
    // }

    process(input) {
        let output = "hello " + input
        return output
    }
}