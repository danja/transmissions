// src/processors/markup/LinkFinder.js
import * as cheerio from 'cheerio'

import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

/**
 * @class LinkFinder
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Extracts links and headers from HTML content in messages, converting them to Markdown-style references and optionally resolving relative URLs.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * None specific (uses message content and sourceURL)
 *
 * #### __*Input*__
 * * **`message`** - The message object containing HTML content (typically in a property like `htmlContent`) and optionally `sourceURL`
 *
 * #### __*Output*__
 * * **`message`** - The message, potentially augmented with extracted links/headers
 *
 * #### __*Behavior*__
 * * Parses HTML content to find anchor (`<a>`) and header (`<h1>`-`<h6>`) tags
 * * Converts found links to Markdown format, resolving relative URLs if a base is provided
 * * Emits or augments message with extracted data
 * * Logs key actions and events
 *
 * #### __*Side Effects*__
 * * None
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Handle edge cases and malformed HTML
 * * Add tests for various HTML structures
 */

class LinkFinder extends Processor {

    async process(message) {

        await this.extractLinks(message)

        if (data === '~~done~~') {
            logger.log('LF DONE*****************')
            return this.emitLocal('message', '~~done~~', message)
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
                label = `\n\n${'#'.repeat(parseInt(level))} ${headerText}\n`
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
                    href = new URL(href, baseURL).toString()
                }
                label = `\n[${linkText}](${href})`

            }
            message.label = label
            return this.emit('message', message)
        })
    }
}

export default LinkFinder