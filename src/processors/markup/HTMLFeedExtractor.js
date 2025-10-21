// src/processors/markup/HTMLFeedExtractor.js

import * as cheerio from 'cheerio'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'

/**
 * @class HTMLFeedExtractor
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Extracts RSS/Atom feed URLs from HTML content by parsing <link> tags with rel="alternate".
 * Searches for common feed types (RSS 2.0, RSS 1.0, Atom, JSON Feed) and resolves relative URLs.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.inputField`** - Field containing HTML content (default: 'http.data')
 * * **`ns.trn.outputField`** - Field to store discovered feed URL (default: 'feedUrl')
 * * **`ns.trn.baseUrlField`** - Field containing base URL for resolving relative links (default: 'url')
 * * **`ns.trn.preferredType`** - Preferred feed type if multiple found: 'rss', 'atom', 'json' (default: first found)
 *
 * #### __*Input*__
 * * **`message.http.data`** - HTML content to parse (or custom field via inputField)
 * * **`message.url`** - Base URL for resolving relative feed URLs (or custom field via baseUrlField)
 *
 * #### __*Output*__
 * * **`message.feedUrl`** - Discovered feed URL (absolute), or undefined if none found
 * * **`message.feedType`** - Type of feed found: 'rss', 'atom', 'json', or undefined
 *
 * #### __*Behavior*__
 * * Parses HTML using cheerio
 * * Searches for <link rel="alternate" type="application/rss+xml">
 * * Searches for <link rel="alternate" type="application/atom+xml">
 * * Searches for <link rel="alternate" type="application/feed+json">
 * * Resolves relative URLs to absolute using base URL
 * * Sets outputField to undefined if no feed found
 * * Skips processing if message.done or message.httpError
 *
 * #### __*Side Effects*__
 * * None (pure transformation)
 *
 * #### __*Tests*__
 * * See src/apps/test/htmlfeedextractor-test/
 *
 * #### __*ToDo*__
 * * Add support for detecting feeds via common URL patterns (/feed, /rss, etc.)
 * * Add option to return all found feeds instead of first match
 */
class HTMLFeedExtractor extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug('HTMLFeedExtractor.process')

        // Skip if spawning completion
        if (message.done) {
            return this.emit('message', message)
        }

        // Skip if HTTP error
        if (message.httpError) {
            logger.debug('HTMLFeedExtractor: Skipping due to httpError')
            return this.emit('message', message)
        }

        try {
            // Get configuration
            const inputField = super.getProperty(ns.trn.inputField, 'http.data')
            const outputField = super.getProperty(ns.trn.outputField, 'feedUrl')
            const baseUrlField = super.getProperty(ns.trn.baseUrlField, 'url')
            const preferredType = super.getProperty(ns.trn.preferredType, null)

            // Get HTML content
            const htmlContent = JSONUtils.get(message, inputField)
            const baseUrl = JSONUtils.get(message, baseUrlField)

            if (!htmlContent) {
                logger.debug('HTMLFeedExtractor: No HTML content found')
                JSONUtils.set(message, outputField, undefined)
                return this.emit('message', message)
            }

            // Parse HTML
            const $ = cheerio.load(htmlContent)

            // Search for feed links
            const feeds = this.findFeedLinks($, baseUrl)

            if (feeds.length === 0) {
                logger.debug('HTMLFeedExtractor: No feed links found')
                JSONUtils.set(message, outputField, undefined)
                return this.emit('message', message)
            }

            // Select feed based on preference or first match
            const selectedFeed = this.selectFeed(feeds, preferredType)

            JSONUtils.set(message, outputField, selectedFeed.url)
            JSONUtils.set(message, 'feedType', selectedFeed.type)

            logger.log(`HTMLFeedExtractor: Found ${selectedFeed.type} feed at ${selectedFeed.url}`)

            return this.emit('message', message)

        } catch (error) {
            logger.error(`HTMLFeedExtractor: Error parsing HTML - ${error.message}`)
            return this.emit('message', message)
        }
    }

    /**
     * Find all feed links in HTML
     * @param {CheerioAPI} $ - Cheerio instance
     * @param {string} baseUrl - Base URL for resolving relative links
     * @returns {Array<{url: string, type: string}>} Array of feed objects
     */
    findFeedLinks($, baseUrl) {
        const feeds = []

        // Find RSS feeds
        $('link[rel="alternate"][type="application/rss+xml"]').each((_, element) => {
            const href = $(element).attr('href')
            if (href) {
                feeds.push({
                    url: this.resolveUrl(href, baseUrl),
                    type: 'rss'
                })
            }
        })

        // Find Atom feeds
        $('link[rel="alternate"][type="application/atom+xml"]').each((_, element) => {
            const href = $(element).attr('href')
            if (href) {
                feeds.push({
                    url: this.resolveUrl(href, baseUrl),
                    type: 'atom'
                })
            }
        })

        // Find JSON feeds
        $('link[rel="alternate"][type="application/feed+json"]').each((_, element) => {
            const href = $(element).attr('href')
            if (href) {
                feeds.push({
                    url: this.resolveUrl(href, baseUrl),
                    type: 'json'
                })
            }
        })

        // Also check for application/json+feed (alternate format)
        $('link[rel="alternate"][type="application/json+feed"]').each((_, element) => {
            const href = $(element).attr('href')
            if (href) {
                feeds.push({
                    url: this.resolveUrl(href, baseUrl),
                    type: 'json'
                })
            }
        })

        return feeds
    }

    /**
     * Select feed based on preference
     * @param {Array<{url: string, type: string}>} feeds - Array of feed objects
     * @param {string|null} preferredType - Preferred feed type
     * @returns {{url: string, type: string}} Selected feed
     */
    selectFeed(feeds, preferredType) {
        if (!preferredType || feeds.length === 1) {
            return feeds[0]
        }

        // Try to find preferred type
        const preferred = feeds.find(feed => feed.type === preferredType)
        return preferred || feeds[0]
    }

    /**
     * Resolve relative URL to absolute
     * @param {string} href - URL to resolve
     * @param {string} baseUrl - Base URL
     * @returns {string} Absolute URL
     */
    resolveUrl(href, baseUrl) {
        if (!href) return ''

        // Already absolute
        if (href.includes('://')) {
            return href
        }

        // Resolve relative URL
        if (baseUrl) {
            try {
                return new URL(href, baseUrl).toString()
            } catch (error) {
                logger.debug(`HTMLFeedExtractor: Error resolving URL ${href} with base ${baseUrl}`)
                return href
            }
        }

        return href
    }
}

export default HTMLFeedExtractor
