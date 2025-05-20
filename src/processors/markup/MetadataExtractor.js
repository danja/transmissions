// src/processors/markup/MetadataExtractor.js
import * as cheerio from 'cheerio'

import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

/**
 * @class MetadataExtractor
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Extracts metadata from file content (e.g., emails), converts it to JSON, and emits a new message with the processed content and a new filename.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * None specific (uses message fields and config for processing logic)
 *
 * #### __*Input*__
 * * **`data.filename`** - The original filename
 * * **`data.content`** - The file content to extract metadata from
 *
 * #### __*Output*__
 * * **`output.filename`** - The target filename, typically with a new extension
 * * **`output.content`** - The extracted metadata as a JSON string
 *
 * #### __*Behavior*__
 * * Reads file content and filename from the input
 * * Extracts metadata and converts it to JSON
 * * Emits a new message with updated filename and JSON content
 * * Logs key actions for debugging
 *
 * #### __*Side Effects*__
 * * None (message is transformed, not mutated in place)
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Add support for more metadata formats
 * * Add tests for various file types and edge cases
 */

class MetadataExtractor extends Processor {

    async process(message) {
        const filename = data.filename
        const content = data.content

        logger.debug("MetadataExtractor input file : " + filename)
        const targetFilename = this.relocate(filename)
        logger.debug("MetadataExtractor outputfile : " + targetFilename)

        const jsonData = this.convertEmailToJSON(content)

        const jsonString = JSON.stringify(jsonData)

        const output = { filename: targetFilename, content: jsonString }

        return this.emit('message', output, message)
    }

    relocate(filename) {
        //   var newFileName = filename.replace(/\. \w+$/, '.json')
        const split = filename.split('.').slice(0, -1)
        var newFileName = split.join('.') + '.json'
        return newFileName
    }

    convertEmailToJSON(htmlContent) {
        const $ = cheerio.load(htmlContent)
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

        return jsonResult
    }

    pruneContent(content) {
        // "keep this\nremove this\n\n>: keep this";
        const regex1 = /(^|\n).*?:\n>/s
        content = content.replace(regex1, '$1')

        const regex2 = /\n>.*?\n/g

        //   const inputString = "keep before\n>remove this\nkeep after";
        //   const cleanedString = inputString.replace(regex2, '\n');
        //   console.log(cleanedString);
        content = content.replace(regex2, '\n')
        //  content = (content + '\n').replace(regex2, '\n').trim();
        return content
    }
}



export default MetadataExtractor