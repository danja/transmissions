import * as cheerio from 'cheerio'

import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'

class LinkFinder extends ProcessProcessor {

    async execute(message) {

        await this.extractLinks(message)

        if (data === '~~done~~') {
            logger.log('LF DONE*****************')
            this.emitLocal('message', '~~done~~', message)
            return
        }
    }


    relocate(filename, extension) {
        const split = filename.split('.').slice(0, -1)
        return split.join('.') + extension
    }

    async extractLinks(htmlContent, message) {

        const $ = cheerio.load(htmlContent)
        let label = ''

        $('a, h1, h2, h3, h4, h5, h6').each((_, element) => {
            const tagName = element.tagName.toLowerCase()
            if (tagName.startsWith('h')) {
                const level = tagName.substring(1)
                const headerText = $(element).text()
                label = `\n\n${'#'.repeat(parseInt(level))} ${headerText}\n`;
            } else if (tagName === 'a') {
                const linkText = $(element).text()
                //  logger.debug('linkText = ' + linkText)
                let href = $(element).attr('href')
                // logger.debug('href = ' + href)
                if (!href || href.startsWith('#')) return
                // Create an absolute URL if the href is relative
                if (href && !href.includes('://')) {
                    //  logger.debug('message.sourceURL = ' + message.sourceURL)
                    const baseURL = message.sourceURL
                    //  logger.debug('this.baseUrl = ' + baseURL)
                    href = new URL(href, baseURL).toString();
                }
                label = `\n[${linkText}](${href})`

            }
            message.label = label
            this.emit('message', message)
        })
    }
}

export default LinkFinder