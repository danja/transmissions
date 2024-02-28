
import logger from '../utils/Logger.js'
import Source from '../mill/SourceService.js';

class StringSource extends Source {

    execute(config) {
        return "Hello"
    }

    // read(sourceID) {
    //   logger.log("StringSource.read : " + sourceID)
    //  return "hello"
    // }
}

export default StringSource




