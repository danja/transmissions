// src/processors/markup/OpmlFeedExtractor.js

import * as cheerio from 'cheerio'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'

/**
 * @class OpmlFeedExtractor
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Extracts feed URLs from an OPML document.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.inputField`** - Field containing OPML XML (default: 'content')
 * * **`ns.trn.outputField`** - Field to store extracted feed URLs (default: 'feedUrls')
 * * **`ns.trn.unique`** - De-duplicate URLs (default: 'true')
 *
 * #### __*Input*__
 * * **`message.content`** - OPML XML string
 *
 * #### __*Output*__
 * * **`message.feedUrls`** - Array of feed URLs
 */
class OpmlFeedExtractor extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug('OpmlFeedExtractor.process')

        if (message.done) {
            return this.emit('message', message)
        }

        const inputField = super.getProperty(ns.trn.inputField, 'content')
        const outputField = super.getProperty(ns.trn.outputField, 'feedUrls')
        const unique = super.getProperty(ns.trn.unique, 'true') !== 'false'

        const opml = JSONUtils.get(message, inputField)
        if (!opml) {
            JSONUtils.set(message, outputField, [])
            return this.emit('message', message)
        }

        try {
            const $ = cheerio.load(opml, { xmlMode: true })
            const urls = []
            const seen = new Set()

            $('outline').each((_, element) => {
                const xmlUrl = $(element).attr('xmlUrl')
                    || $(element).attr('xmlurl')
                    || $(element).attr('xmlURL')
                    || $(element).attr('url')

                if (!xmlUrl) {
                    return
                }

                const trimmed = String(xmlUrl).trim()
                if (!trimmed) {
                    return
                }

                if (unique) {
                    if (seen.has(trimmed)) {
                        return
                    }
                    seen.add(trimmed)
                }

                urls.push(trimmed)
            })

            JSONUtils.set(message, outputField, urls)
            logger.log(`OpmlFeedExtractor: Found ${urls.length} feed URLs`)
            return this.emit('message', message)
        } catch (error) {
            logger.error(`OpmlFeedExtractor: Error parsing OPML - ${error.message}`)
            JSONUtils.set(message, outputField, [])
            return this.emit('message', message)
        }
    }
}

export default OpmlFeedExtractor
