import * as cheerio from 'cheerio'

import logger from '../../utils/Logger.js'
import ProcessService from '../../mill/ProcessService.js';

class MetadataExtractor extends ProcessService {

    async execute(data) {
        const filename = data.filename
        const contents = data.contents

        logger.debug("MetadataExtractor input file : " + filename)
        const targetFilename = this.relocate(filename)
        logger.debug("MetadataExtractor outputfile : " + targetFilename)

        const jsonData = this.convertEmailToJSON(contents)

        const jsonString = JSON.stringify(jsonData)

        const output = { filename: targetFilename, content: jsonString }

        this.emit('data', output)
    }

    relocate(filename) {
        //   var newFileName = filename.replace(/\. \w+$/, '.json')
        const split = filename.split('.').slice(0, -1)
        var newFileName = split.join('.') + '.json'
        return newFileName
    }

    convertEmailToJSON(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const jsonResult = {
            subject: $('H1').text().trim(),
            from: $('B').first().text().trim() + ' ' + $('A').first().attr('href').match(/mailto:(.+\?)/)[1].replace('?Subject=', ' '),
            cc: '', // The sample does not contain a CC field to extract

            'next-message': $('LINK[REL="Next"]').attr('HREF'),
            'previous-message': $('LINK[REL="Previous"]').attr('HREF'),
            'message-text': $('PRE').text().trim()
        };

        // Removing parameters from email address in 'from' field
        jsonResult.from = jsonResult.from.split('?')[0];

        //    'in-reply-to': $('LINK[REL="made"]').attr('HREF').match(/In-Reply-To=(.*)/)[1],

        return jsonResult;
    }
}



export default MetadataExtractor