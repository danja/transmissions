
import logger from '../utils/Logger.js'
import Source from '../mill/SourceService.js';

class StringSource extends Source {

    read(sourceID) {
        logger.log("StringSource.read : " + sourceID)
        return "hello"
    }
}

export default StringSource




