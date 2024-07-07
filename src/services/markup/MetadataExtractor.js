import * as cheerio from 'cheerio'

import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class MetadataExtractor extends ProcessService {

    async execute(context) {
        const filename = data.filename
        const content = data.content

        logger.debug("MetadataExtractor input file : " + filename)
        const targetFilename = this.relocate(filename)
        logger.debug("MetadataExtractor outputfile : " + targetFilename)

        const jsonData = this.convertEmailToJSON(content)

        const jsonString = JSON.stringify(jsonData)

        const output = { filename: targetFilename, content: jsonString }

        this.emit('message', output, context)
    }

    relocate(filename) {
        //   var newFileName = filename.replace(/\. \w+$/, '.json')
        const split = filename.split('.').slice(0, -1)
        var newFileName = split.join('.') + '.json'
        return newFileName
    }

    convertEmailToJSON(htmlContent) {
        const $ = cheerio.load(htmlContent);
        var subjectLine = $('H1').text().trim()
        var fromName = $('B').first().text().trim()
        var nextMessageLink = $('LINK[REL="Next"]').attr('HREF')
        var previousMessageLink = $('LINK[REL="Previous"]').attr('HREF')
        var messageText = $('PRE').text().trim()
        messageText = this.pruneContent(messageText)
        const jsonResult = {
            subjectLine: subjectLine,
            fromName: fromName,
            nextMessageLink: nextMessageLink,
            previousMessageLink: previousMessageLink,
            messageText: messageText

        }

        /*
                const jsonResult = {
                    subject: $('H1').text().trim(),
                    from: $('B').first().text().trim(),
                    'next-message': $('LINK[REL="Next"]').attr('HREF'),
                    'previous-message': $('LINK[REL="Previous"]').attr('HREF'),
                    'message-text': $('PRE').text().trim()
                };
                */

        /*
        + ' ' + $('A').first().attr('href').match(/mailto:(.+\?)/)[1].replace('?Subject=', ' '),
            cc: '', // The sample does not contain a CC field to extract
        // Removing parameters from email address in 'from' field
        jsonResult.from = jsonResult.from.split('?')[0];

        //    'in-reply-to': $('LINK[REL="made"]').attr('HREF').match(/In-Reply-To=(.*)/)[1],
        */
        /*
        :\n\n>
        */

        return jsonResult;
    }

    pruneContent(content) {
        // "keep this\nremove this\n\n>: keep this";
        const regex1 = /(^|\n).*?:\n>/s
        content = content.replace(regex1, '$1')

        const regex2 = /\n>.*?\n/g;

        //   const inputString = "keep before\n>remove this\nkeep after";
        //   const cleanedString = inputString.replace(regex2, '\n');
        //   console.log(cleanedString);
        content = content.replace(regex2, '\n')
        //  content = (content + '\n').replace(regex2, '\n').trim();
        return content
    }
}



export default MetadataExtractor