// src/processors/util/FeedUrlDeduplicator.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'

/**
 * @class FeedUrlDeduplicator
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Filters out feeds that already exist in the SPARQL store.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.inputField`** - Field containing the feed URL to check (default: 'url')
 * * **`ns.trn.existingField`** - Field containing existing feed URLs (default: 'existingFeedUrls')
 * * **`ns.trn.skipDuplicates`** - Skip duplicate messages (default: 'true')
 *
 * #### __*Input*__
 * * **`message.url`** - Feed URL to check (or custom field via inputField)
 * * **`message.queryResults`** - Optional SPARQL results with `feedUrl` bindings
 * * **`message.existingFeedUrls`** - Optional list of feed URLs
 *
 * #### __*Output*__
 * * **`message.isDuplicate`** - Boolean: true if feed already exists
 */
class FeedUrlDeduplicator extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug('FeedUrlDeduplicator.process')

        if (message.done) {
            return this.emit('message', message)
        }

        const inputField = super.getProperty(ns.trn.inputField, 'url')
        const existingField = super.getProperty(ns.trn.existingField, 'existingFeedUrls')
        const skipDuplicates = super.getProperty(ns.trn.skipDuplicates, 'true') !== 'false'

        const url = JSONUtils.get(message, inputField)
        if (!url) {
            return this.emit('message', message)
        }

        const existing = this.getExistingUrls(message, existingField)
        const normalizedUrl = this.normalizeUrl(url)
        const isDuplicate = existing.has(normalizedUrl)

        message.isDuplicate = isDuplicate

        if (isDuplicate) {
            logger.log(`FeedUrlDeduplicator: Skipping existing feed ${url}`)
            if (skipDuplicates) {
                return
            }
        }

        return this.emit('message', message)
    }

    getExistingUrls(message, existingField) {
        const existing = new Set()

        const existingUrls = JSONUtils.get(message, existingField) || []
        existingUrls.forEach(url => {
            if (url) {
                existing.add(this.normalizeUrl(url))
            }
        })

        const bindings = message.queryResults?.results?.bindings || []
        bindings.forEach(binding => {
            const feedUrl = binding.feedUrl?.value || binding.url?.value
            if (feedUrl) {
                existing.add(this.normalizeUrl(feedUrl))
            }
        })

        return existing
    }

    normalizeUrl(url) {
        if (!url) return ''
        let normalized = String(url).trim()
        if (normalized.endsWith('/') && normalized.split('/').length > 3) {
            normalized = normalized.slice(0, -1)
        }
        return normalized.toLowerCase()
    }
}

export default FeedUrlDeduplicator
