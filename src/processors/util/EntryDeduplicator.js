// src/processors/util/EntryDeduplicator.js

import crypto from 'crypto'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
import JSONUtils from '../../utils/JSONUtils.js'

/**
 * @class EntryDeduplicator
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Checks if a feed entry already exists in the SPARQL store using GUID, link, or content hash.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.guidField`** - Path to GUID field in message (default: 'currentItem.guid')
 * * **`ns.trn.linkField`** - Path to link field in message (default: 'currentItem.link')
 * * **`ns.trn.useContentHash`** - Use content hash as fallback (default: 'true')
 * * **`ns.trn.contentField`** - Path to content field for hashing (default: 'currentItem.content')
 * * **`ns.trn.checkMethod`** - Method to use: 'guid', 'link', 'hash', 'all' (default: 'all')
 * * **`ns.trn.skipDuplicates`** - Don't emit duplicate messages (default: 'true')
 *
 * #### __*Input*__
 * * **`message.currentItem`** - Feed entry to check (or custom path via settings)
 * * **`message.sparqlResults`** - Optional: Pre-fetched SPARQL results to check against
 *
 * #### __*Output*__
 * * **`message.isDuplicate`** - Boolean: true if entry exists, false otherwise
 * * **`message.existingURI`** - URI of existing entry (if found)
 * * **`message.matchMethod`** - How the duplicate was found: 'guid', 'link', or 'hash'
 * * **`message.entryHash`** - Content hash (if useContentHash is true)
 *
 * #### __*Behavior*__
 * * Checks for duplicates in order: GUID → Link → Content Hash
 * * Sets isDuplicate=true if any method finds a match
 * * By default, does NOT emit duplicate messages (silently filters them)
 * * Set skipDuplicates=false to emit all messages with isDuplicate flag
 * * Can be configured to use only specific check methods
 * * Generates MD5 hash of content for hash-based deduplication
 * * Skips processing if message.done is true
 *
 * #### __*Side Effects*__
 * * None (pure checking, no SPARQL queries - expects pre-fetched results)
 *
 * #### __*Usage Pattern*__
 * Typically used with SPARQLSelect to fetch existing entries first:
 * ```
 * SPARQLSelect (get all entry IDs) → EntryDeduplicator → Choice → SPARQLUpdate
 * ```
 *
 * #### __*Tests*__
 * * See src/apps/test/entrydeduplicator-test/
 *
 * #### __*ToDo*__
 * * Add internal SPARQL query support (optional)
 * * Support batch deduplication
 */
class EntryDeduplicator extends Processor {
    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug('EntryDeduplicator.process')

        // Skip if spawning completion
        if (message.done) {
            return this.emit('message', message)
        }

        try {
            // Get configuration
            const guidField = super.getProperty(ns.trn.guidField, 'currentItem.guid')
            const linkField = super.getProperty(ns.trn.linkField, 'currentItem.link')
            const contentField = super.getProperty(ns.trn.contentField, 'currentItem.content')
            const useContentHash = super.getProperty(ns.trn.useContentHash, 'true') === 'true'
            const checkMethod = super.getProperty(ns.trn.checkMethod, 'all')
            const skipDuplicates = super.getProperty(ns.trn.skipDuplicates, 'true') === 'true'

            // Extract values from message
            const guid = JSONUtils.get(message, guidField)
            const link = JSONUtils.get(message, linkField)
            const content = JSONUtils.get(message, contentField)

            // Initialize result
            message.isDuplicate = false
            message.existingURI = null
            message.matchMethod = null

            // Get existing entries from SPARQL results (if provided)
            const existingEntries = message.queryResults?.results?.bindings || []

            logger.debug(`EntryDeduplicator: Checking ${existingEntries.length} existing entries`)
            logger.debug(`  GUID: ${guid}`)
            logger.debug(`  Link: ${link}`)

            // Check by GUID (most reliable)
            if ((checkMethod === 'all' || checkMethod === 'guid') && guid) {
                const match = existingEntries.find(entry => {
                    const entryGuid = entry.id?.value || entry.guid?.value
                    return entryGuid === guid
                })
                if (match) {
                    message.isDuplicate = true
                    message.existingURI = match.post?.value || match.entry?.value
                    message.matchMethod = 'guid'
                    logger.log(`EntryDeduplicator: Duplicate found by GUID: ${guid}`)
                    if (skipDuplicates) {
                        logger.debug(`EntryDeduplicator: Skipping duplicate message`)
                        return // Don't emit
                    }
                    return this.emit('message', message)
                }
            }

            // Check by link (fallback)
            if ((checkMethod === 'all' || checkMethod === 'link') && link) {
                const match = existingEntries.find(entry => {
                    const entryLink = entry.link?.value
                    return entryLink === link
                })
                if (match) {
                    message.isDuplicate = true
                    message.existingURI = match.post?.value || match.entry?.value
                    message.matchMethod = 'link'
                    logger.log(`EntryDeduplicator: Duplicate found by link: ${link}`)
                    if (skipDuplicates) {
                        logger.debug(`EntryDeduplicator: Skipping duplicate message`)
                        return // Don't emit
                    }
                    return this.emit('message', message)
                }
            }

            // Check by content hash (last resort)
            if ((checkMethod === 'all' || checkMethod === 'hash') && useContentHash && content) {
                const contentHash = this.hashContent(content)
                message.entryHash = contentHash

                const match = existingEntries.find(entry => {
                    const entryHash = entry.hash?.value
                    return entryHash === contentHash
                })
                if (match) {
                    message.isDuplicate = true
                    message.existingURI = match.post?.value || match.entry?.value
                    message.matchMethod = 'hash'
                    logger.log(`EntryDeduplicator: Duplicate found by content hash: ${contentHash}`)
                    if (skipDuplicates) {
                        logger.debug(`EntryDeduplicator: Skipping duplicate message`)
                        return // Don't emit
                    }
                    return this.emit('message', message)
                }
            }

            // Not a duplicate
            logger.debug(`EntryDeduplicator: Entry is unique`)
            return this.emit('message', message)

        } catch (error) {
            logger.error(`EntryDeduplicator: Error checking duplicate - ${error.message}`)
            message.deduplicationError = error.message
            // On error, assume not duplicate to avoid losing data
            message.isDuplicate = false
            return this.emit('message', message)
        }
    }

    /**
     * Generate MD5 hash of content for deduplication
     */
    hashContent(content) {
        if (!content) return null
        // Normalize content: remove extra whitespace, lowercase
        const normalized = String(content)
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim()
        return crypto.createHash('md5').update(normalized).digest('hex')
    }
}

export default EntryDeduplicator
