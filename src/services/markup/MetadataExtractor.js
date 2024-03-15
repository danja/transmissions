import * as cheerio from 'cheerio'

import logger from '../../utils/Logger.js'
import ProcessService from '../../mill/ProcessService.js';

class MetadataExtractor extends ProcessService {

    async execute(data) {
        const filename = data.filename
        const contents = data.contents
        logger.debug("MetadataExtractor input : " + filename)

        const $ = cheerio.load(contents);

        const output = $('h1').text();
        //  return output
        this.emit('data', output)
    }
}

export default MetadataExtractor