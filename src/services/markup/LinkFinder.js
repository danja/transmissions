import * as cheerio from 'cheerio'

import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class LinkFinder extends ProcessService {

    async execute(data, context) {
        this.baseUrl = 'http://example.org'
        const filename = context.filename
        const content = data

        logger.debug("LinkFinder input file : " + filename)
        const targetFilename = this.relocate(filename, '.md')
        logger.debug("LinkFinder outputfile : " + targetFilename)

        const markdown = this.extractLinks(content)

        context.filename = targetFilename

        this.emit('message', markdown, context)
    }

    relocate(filename, extension) {
        const split = filename.split('.').slice(0, -1)
        return split.join('.') + extension
    }

    extractLinks(htmlContent) {
        const $ = cheerio.load(htmlContent);
        let markdownResult = '';

        $('a, h1, h2, h3, h4, h5, h6').each((_, element) => {
            const tagName = element.tagName.toLowerCase();
            if (tagName.startsWith('h')) {
                const level = tagName.substring(1);
                const headerText = $(element).text();
                markdownResult += `${'#'.repeat(parseInt(level))} ${headerText}\n\n`;
            } else if (tagName === 'a') {
                const linkText = $(element).text();
                let href = $(element).attr('href');

                // Create an absolute URL if the href is relative
                if (href && !href.includes('://')) {
                    href = new URL(href, this.baseUrl).toString();
                }
                markdownResult += `[${linkText}](${href})\n`;
            }
        });

        return markdownResult.trim();
    }
}



export default LinkFinder