import logger from '../utils/Logger.js'
import { Process } from './Process.js';

export class AppendProcess extends Process {
    //  constructor(sourceID) {
    //  this.sourceID = sourceID;
    // }

    process(input) {
        logger.log("AppendProcess.process : " + input)
        let output = input + " world"
        return output
    }
}