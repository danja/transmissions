
import logger from '../utils/Logger.js'
import { Source } from './Source.js';

export class StringSource extends Source {
    //  constructor(sourceID) {
    //  this.sourceID = sourceID;
    // }

    read(sourceID) {
        logger.log("StringSource.read : " + sourceID)
        return "hello"
    }
    /*
  read(sourceID) {
      return this.readFile(sourceID)
  }

  readFile(filename) {
      let text = fs.readFileSync(filename, 'utf8')
      return text;
  }
  */
}




