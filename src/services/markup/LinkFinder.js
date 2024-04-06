import * as cheerio from 'cheerio'

import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class LinkFinder extends ProcessService {

    async execute(data, context) {
        /*
        this.baseUrl = 'http://example.org'
        const filename = context.filename
        const content = data

        logger.debug("LinkFinder input file : " + filename)
        const targetFilename = this.relocate(filename, '.md')
        logger.debug("LinkFinder outputfile : " + targetFilename)

        context.filename = targetFilename
        */
        // const markdown = 
        this.extractLinks(data, context)
    }

    relocate(filename, extension) {
        const split = filename.split('.').slice(0, -1)
        return split.join('.') + extension
    }

    async extractLinks(htmlContent, context) {

        const $ = cheerio.load(htmlContent)
        let markdownResult = ''

        $('a, h1, h2, h3, h4, h5, h6').each((_, element) => {
            const tagName = element.tagName.toLowerCase()
            if (tagName.startsWith('h')) {
                const level = tagName.substring(1)
                const headerText = $(element).text()
                markdownResult += `${'#'.repeat(parseInt(level))} ${headerText}\n\n`;
            } else if (tagName === 'a') {
                const linkText = $(element).text()
                //  logger.debug('linkText = ' + linkText)
                let href = $(element).attr('href')
                // logger.debug('href = ' + href)
                if (!href || href.startsWith('#')) return
                // Create an absolute URL if the href is relative
                if (href && !href.includes('://')) {
                    //  logger.debug('context.sourceURL = ' + context.sourceURL)
                    const baseURL = context.sourceURL
                    //  logger.debug('this.baseUrl = ' + baseURL)
                    href = new URL(href, baseURL).toString();
                }
                const linkMd = `[${linkText}](${href})`
                this.emit('message', linkMd, context)
            }
        })
        this.emit('message', '~done~', context)

        //  return markdownResult.trim();
    }
}



export default LinkFinder