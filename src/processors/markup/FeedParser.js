// src/processors/markup/FeedParser.js

import Parser from 'rss-parser'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'

/**
 * @class FeedParser
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Parses RSS 1.0, RSS 2.0, Atom, and JSON Feed formats into a normalized structure.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.inputField`** - Field containing feed XML/JSON (default: 'http.data')
 * * **`ns.trn.outputField`** - Field for parsed feed (default: 'feed')
 * * **`ns.trn.includeRawContent`** - Include raw content (default: false)
 *
 * #### __*Input*__
 * * **`message.http.data`** - The feed XML/JSON string (or custom field via inputField)
 * * **`message.url`** - Feed URL (optional, for context)
 *
 * #### __*Output*__
 * * **`message.feed`** - Normalized feed object:
 *   - `meta`: { title, description, link, feedUrl, lastBuildDate, etc. }
 *   - `entries`: [{ title, link, content, contentSnippet, published, author, guid, ... }]
 *   - `format`: 'rss2.0' | 'rss1.0' | 'atom' | 'json-feed'
 * * **`message.feedError`** - Error message if parsing fails
 *
 * #### __*Behavior*__
 * * Parses feed using rss-parser library
 * * Detects feed format automatically
 * * Normalizes all formats to consistent structure
 * * Handles parsing errors gracefully
 *
 * #### __*Side Effects*__
 * * None (pure transformation)
 *
 * #### __*Tests*__
 * * See src/apps/test/feedparser-test/
 *
 * #### __*ToDo*__
 * * Add support for feed validation
 * * Add custom field mappings
 */
class FeedParser extends Processor {
    constructor(config) {
        super(config)
        this.parser = new Parser({
            customFields: {
                feed: ['subtitle', 'updated', 'generator', 'icon', 'logo'],
                item: [
                    ['content:encoded', 'contentEncoded'],
                    ['dc:creator', 'dcCreator'],
                    ['dc:date', 'dcDate'],
                    ['media:content', 'mediaContent'],
                    ['media:thumbnail', 'mediaThumbnail']
                ]
            }
        })
    }

    async process(message) {
        logger.debug('FeedParser.process')

        // Skip if spawning completion
        if (message.done) {
            return this.emit('message', message)
        }

        try {
            // Get configuration
            const inputField = super.getProperty(ns.trn.inputField, 'http.data')
            const outputField = super.getProperty(ns.trn.outputField, 'feed')
            const includeRaw = super.getProperty(ns.trn.includeRawContent, 'false') === 'true'

            // Get feed content
            const feedContent = this.getNestedField(message, inputField)

            if (!feedContent) {
                logger.error('FeedParser: No feed content found in input field')
                message.feedError = 'No feed content provided'
                return this.emit('message', message)
            }

            logger.debug(`FeedParser: Parsing feed, content length: ${feedContent.length}`)

            // Parse feed
            const parsed = await this.parser.parseString(feedContent)

            // Detect format
            const format = this.detectFormat(feedContent, parsed)

            // Build normalized structure
            const feed = {
                format: format,
                meta: {
                    title: parsed.title || '',
                    description: parsed.description || '',
                    link: parsed.link || message.url || '',
                    feedUrl: parsed.feedUrl || message.url || '',
                    lastBuildDate: parsed.lastBuildDate || parsed.pubDate || parsed.updated || null,
                    language: parsed.language || null,
                    generator: parsed.generator || null,
                    author: parsed.author || parsed.creator || null
                },
                entries: (parsed.items || []).map(item => this.normalizeEntry(item))
            }

            // Store in message
            this.setNestedField(message, outputField, feed)

            if (includeRaw) {
                message.feedRaw = feedContent
            }

            logger.log(`FeedParser: Parsed ${feed.entries.length} entries from ${format} feed`)

            return this.emit('message', message)

        } catch (error) {
            logger.error(`FeedParser: Error parsing feed - ${error.message}`)
            message.feedError = error.message
            return this.emit('message', message)
        }
    }

    /**
     * Detect feed format from content
     */
    detectFormat(content, parsed) {
        if (content.includes('<rss') && content.includes('version="2.0"')) {
            return 'rss2.0'
        } else if (content.includes('<rdf:RDF') || content.includes('xmlns:rdf')) {
            return 'rss1.0'
        } else if (content.includes('<feed') && content.includes('xmlns="http://www.w3.org/2005/Atom"')) {
            return 'atom'
        } else if (content.trim().startsWith('{')) {
            return 'json-feed'
        }
        return 'unknown'
    }

    /**
     * Normalize entry to consistent structure
     */
    normalizeEntry(item) {
        return {
            title: item.title || '',
            link: item.link || item.guid || '',
            guid: item.guid || item.id || item.link || '',
            published: item.pubDate || item.isoDate || item.dcDate || null,
            updated: item.updated || null,
            author: item.creator || item.dcCreator || item.author || null,
            content: item['content:encoded'] || item.contentEncoded || item.content || item.summary || '',
            contentSnippet: item.contentSnippet || '',
            summary: item.summary || item.contentSnippet || '',
            categories: item.categories || [],
            enclosure: item.enclosure || null,
            mediaContent: item.mediaContent || null,
            mediaThumbnail: item.mediaThumbnail || null
        }
    }

    /**
     * Get nested field using dot notation
     */
    getNestedField(obj, path) {
        const parts = path.split('.')
        let current = obj
        for (const part of parts) {
            if (current === undefined || current === null) return undefined
            current = current[part]
        }
        return current
    }

    /**
     * Set nested field using dot notation
     */
    setNestedField(obj, path, value) {
        const parts = path.split('.')
        let current = obj
        for (let i = 0; i < parts.length - 1; i++) {
            if (!(parts[i] in current)) {
                current[parts[i]] = {}
            }
            current = current[parts[i]]
        }
        current[parts[parts.length - 1]] = value
    }
}

export default FeedParser
