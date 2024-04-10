import * as cheerio from 'cheerio'

import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class LinkFinder extends ProcessService {

    async execute(data, context) {

        await this.extractLinks(data, context)

        if (data === '~~done~~') {
            logger.log('LF DONE*****************')
            this.emitLocal('message', '~~done~~', context)
            return
        }
    }

    emitLocal(label, data, context) {
        logger.log('emitLocal === ' + data)
        this.emit(label, data, context)
    }

    relocate(filename, extension) {
        const split = filename.split('.').slice(0, -1)
        return split.join('.') + extension
    }

    async extractLinks(htmlContent, context) {

        const $ = cheerio.load(htmlContent)
        let message = ''

        $('a, h1, h2, h3, h4, h5, h6').each((_, element) => {
            const tagName = element.tagName.toLowerCase()
            if (tagName.startsWith('h')) {
                const level = tagName.substring(1)
                const headerText = $(element).text()
                message = `\n\n${'#'.repeat(parseInt(level))} ${headerText}\n`;
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
                message = `\n[${linkText}](${href})`

            }
            this.emitLocal('message', message, context)
        })
    }
}

export default LinkFinder