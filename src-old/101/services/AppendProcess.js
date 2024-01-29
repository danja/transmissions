import { Process } from './Process.js';

export class AppendProcess extends Process {
    //  constructor(sourceID) {
    //  this.sourceID = sourceID;
    // }

    process(input) {
        let output = input + " world"
        return output
    }
}