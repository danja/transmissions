
import logger from '../utils/Logger.js'
import Source from '../mill/SourceService.js';

class StringSource extends Source {

    execute(config) {
        return config["inputString"]
    }
}

export default StringSource




