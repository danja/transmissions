// src/processors/markup/AtomBuilder.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'

/**
 * @class AtomBuilder
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Builds valid Atom 1.0 feeds from article/entry data with proper formatting.
 * Handles RFC 3339 date formatting, content escaping, and all required Atom elements.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.inputField`** - Field containing array of entries (default: 'entries')
 * * **`ns.trn.outputField`** - Field to store generated Atom XML (default: 'content')
 * * **`ns.trn.feedTitle`** - Feed title (default: 'Atom Feed')
 * * **`ns.trn.feedSubtitle`** - Feed subtitle (optional)
 * * **`ns.trn.feedAuthorName`** - Feed author name (default: 'Author')
 * * **`ns.trn.feedAuthorEmail`** - Feed author email (optional)
 * * **`ns.trn.feedUrl`** - Feed's own URL (default: baseUrl + '/atom.xml')
 * * **`ns.trn.baseUrl`** - Base URL for the site (default: 'https://example.com')
 * * **`ns.trn.feedId`** - Unique feed ID (default: feedUrl)
 *
 * #### __*Input*__
 * * **`message.entries`** - Array of entry objects with fields:
 *   - `title` (required) - Entry title
 *   - `content` (required) - Entry content (HTML)
 *   - `uri` (required) - Unique entry identifier/URL
 *   - `published` (optional) - Publication date (ISO string or timestamp)
 *   - `updated` (optional) - Update date (ISO string or timestamp)
 *   - `summary` (optional) - Entry summary
 *   - `link` (optional) - Alternate link URL
 *
 * #### __*Output*__
 * * **`message.content`** - Valid Atom 1.0 XML feed string
 *
 * #### __*Behavior*__
 * * Generates valid Atom 1.0 XML
 * * Formats dates to RFC 3339 (required by Atom spec)
 * * Escapes HTML content for XML safety
 * * Includes all required Atom elements (id, title, updated, author, link)
 * * Uses current timestamp if entry dates missing
 * * Feed updated time is the most recent entry time
 *
 * #### __*Side Effects*__
 * * None (pure transformation)
 *
 * #### __*Tests*__
 * * See src/apps/test/atombuilder-test/
 *
 * #### __*ToDo*__
 * * Add support for categories/tags
 * * Add support for multiple authors per entry
 * * Add support for enclosures/media
 */
class AtomBuilder extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug('AtomBuilder.process')

        // Skip if spawning completion
        if (message.done) {
            return this.emit('message', message)
        }

        try {
            // Get configuration
            const inputField = super.getProperty(ns.trn.inputField, 'entries')
            const outputField = super.getProperty(ns.trn.outputField, 'content')
            const feedTitle = super.getProperty(ns.trn.feedTitle, 'Atom Feed')
            const feedSubtitle = super.getProperty(ns.trn.feedSubtitle, null)
            const authorName = super.getProperty(ns.trn.feedAuthorName, 'Author')
            const authorEmail = super.getProperty(ns.trn.feedAuthorEmail, null)
            const baseUrl = super.getProperty(ns.trn.baseUrl, 'https://example.com')
            const feedUrl = super.getProperty(ns.trn.feedUrl, `${baseUrl}/atom.xml`)
            const feedId = super.getProperty(ns.trn.feedId, feedUrl)

            // Get entries
            const entries = JSONUtils.get(message, inputField) || []

            if (!Array.isArray(entries)) {
                logger.error('AtomBuilder: Input field is not an array')
                return this.emit('message', message)
            }

            logger.log(`AtomBuilder: Building Atom feed with ${entries.length} entries`)

            // Find most recent update time
            const now = new Date()
            let feedUpdated = now

            for (const entry of entries) {
                const entryDate = this.parseDate(entry.updated || entry.published)
                if (entryDate && entryDate > feedUpdated) {
                    feedUpdated = entryDate
                }
            }

            // Build Atom feed
            const atomXml = this.buildAtomFeed({
                title: feedTitle,
                subtitle: feedSubtitle,
                authorName,
                authorEmail,
                baseUrl,
                feedUrl,
                feedId,
                updated: feedUpdated,
                entries
            })

            JSONUtils.set(message, outputField, atomXml)

            return this.emit('message', message)

        } catch (error) {
            logger.error(`AtomBuilder: Error building Atom feed - ${error.message}`)
            return this.emit('message', message)
        }
    }

    /**
     * Build complete Atom feed XML
     */
    buildAtomFeed(config) {
        const { title, subtitle, authorName, authorEmail, baseUrl, feedUrl, feedId, updated, entries } = config

        let xml = '<?xml version="1.0" encoding="utf-8"?>\n'
        xml += '<feed xmlns="http://www.w3.org/2005/Atom">\n'

        // Required feed elements
        xml += `  <title>${this.escapeXml(title)}</title>\n`
        xml += `  <id>${this.escapeXml(feedId)}</id>\n`
        xml += `  <updated>${this.toRFC3339(updated)}</updated>\n`

        // Links
        xml += `  <link href="${this.escapeXml(feedUrl)}" rel="self" />\n`
        xml += `  <link href="${this.escapeXml(baseUrl)}" />\n`

        // Optional subtitle
        if (subtitle) {
            xml += `  <subtitle>${this.escapeXml(subtitle)}</subtitle>\n`
        }

        // Author
        xml += '  <author>\n'
        xml += `    <name>${this.escapeXml(authorName)}</name>\n`
        if (authorEmail) {
            xml += `    <email>${this.escapeXml(authorEmail)}</email>\n`
        }
        xml += '  </author>\n'

        // Entries
        for (const entry of entries) {
            xml += this.buildEntry(entry, baseUrl, authorName, authorEmail)
        }

        xml += '</feed>\n'

        return xml
    }

    /**
     * Build single Atom entry
     */
    buildEntry(entry, baseUrl, defaultAuthorName, defaultAuthorEmail) {
        const now = new Date()
        const published = this.parseDate(entry.published) || now
        const updated = this.parseDate(entry.updated) || published

        // Build entry URL from uri or link
        const entryId = entry.uri || entry.id || entry.link || `${baseUrl}/${Date.now()}`
        const entryLink = entry.link || entry.uri || entryId

        let xml = '  <entry>\n'

        // Required entry elements
        xml += `    <title>${this.escapeXml(entry.title || 'Untitled')}</title>\n`
        xml += `    <id>${this.escapeXml(entryId)}</id>\n`
        xml += `    <updated>${this.toRFC3339(updated)}</updated>\n`

        // Links
        xml += `    <link href="${this.escapeXml(entryLink)}" />\n`
        if (entry.uri && entry.link && entry.uri !== entry.link) {
            xml += `    <link rel="alternate" type="text/html" href="${this.escapeXml(entry.uri)}" />\n`
        }

        // Published (optional but recommended)
        xml += `    <published>${this.toRFC3339(published)}</published>\n`

        // Author (use entry author or fall back to feed author)
        const authorName = entry.authorName || entry.creatorName || defaultAuthorName
        const authorEmail = entry.authorEmail || defaultAuthorEmail

        xml += '    <author>\n'
        xml += `      <name>${this.escapeXml(authorName)}</name>\n`
        if (authorEmail) {
            xml += `      <email>${this.escapeXml(authorEmail)}</email>\n`
        }
        xml += '    </author>\n'

        // Summary (optional)
        if (entry.summary) {
            xml += `    <summary>${this.escapeXml(entry.summary)}</summary>\n`
        }

        // Content (HTML as XHTML)
        if (entry.content) {
            xml += '    <content type="xhtml">\n'
            xml += '      <div xmlns="http://www.w3.org/1999/xhtml">\n'
            // Content is already HTML, just ensure proper indentation
            const contentLines = entry.content.split('\n')
            for (const line of contentLines) {
                if (line.trim()) {
                    xml += `        ${line}\n`
                }
            }
            xml += '      </div>\n'
            xml += '    </content>\n'
        }

        xml += '  </entry>\n'

        return xml
    }

    /**
     * Parse date from various formats
     */
    parseDate(dateInput) {
        if (!dateInput) return null

        if (dateInput instanceof Date) {
            return dateInput
        }

        if (typeof dateInput === 'number') {
            return new Date(dateInput)
        }

        if (typeof dateInput === 'string') {
            const parsed = new Date(dateInput)
            return isNaN(parsed.getTime()) ? null : parsed
        }

        return null
    }

    /**
     * Convert date to RFC 3339 format (required by Atom)
     * Format: YYYY-MM-DDTHH:mm:ssZ or YYYY-MM-DDTHH:mm:ss+00:00
     */
    toRFC3339(date) {
        if (!date) date = new Date()
        if (!(date instanceof Date)) date = this.parseDate(date) || new Date()

        // Use ISO string which is RFC 3339 compliant
        return date.toISOString()
    }

    /**
     * Escape special XML characters
     */
    escapeXml(str) {
        if (str == null) return ''

        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;')
    }
}

export default AtomBuilder
