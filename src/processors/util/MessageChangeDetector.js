// src/processors/util/MessageChangeDetector.js
import { readFile, writeFile } from 'node:fs/promises'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import JSONUtils from '../../utils/JSONUtils.js'
import Processor from '../../model/Processor.js'

/**
 * @class MessageChangeDetector
 * @extends Processor
 * @classdesc
 * Skips processing when a message key/value pair has not changed since last run.
 *
 * Settings:
 * - ns.trn.cacheFile: cache filename or path (default: ".message-change-cache.json")
 * - ns.trn.keyField: message field for unique key (default: "contentBlocks.uri")
 * - ns.trn.valueField: message field for change detection (default: "contentBlocks.created")
 * - ns.trn.forceRebuild: when "true", bypass cache (default: "false")
 */
class MessageChangeDetector extends Processor {
  constructor(config) {
    super(config)
    this.cacheLoaded = false
    this.cache = { items: {} }
    this.cachePath = null
  }

  async process(message) {
    if (message.done) {
      await this.persistCache().catch(err => {
        logger.warn(`MessageChangeDetector: Failed to persist cache - ${err.message}`)
      })
      return this.emit('message', message)
    }

    await this.ensureCacheLoaded(message)

    const forceRebuild = this.getProperty(ns.trn.forceRebuild, 'false') === 'true'
    const keyField = this.getProperty(ns.trn.keyField, 'contentBlocks.uri')
    const valueField = this.getProperty(ns.trn.valueField, 'contentBlocks.created')

    const key = JSONUtils.get(message, keyField)
    const value = JSONUtils.get(message, valueField)

    if (!key || value === undefined || value === null) {
      return this.emit('message', message)
    }

    const cached = this.cache.items[key]
    if (!forceRebuild && cached && cached === value) {
      message.done = true
      message.skipped = true
      logger.debug(`MessageChangeDetector: Unchanged, skipping ${key}`)
      return this.emit('message', message)
    }

    this.cache.items[key] = value
    return this.emit('message', message)
  }

  async ensureCacheLoaded(message) {
    if (this.cacheLoaded) return
    const cacheFile = this.getProperty(ns.trn.cacheFile, '.message-change-cache.json')
    const baseDir = message.targetDir || this.app.path || process.cwd()
    this.cachePath = path.isAbsolute(cacheFile) ? cacheFile : path.join(baseDir, cacheFile)
    try {
      const raw = await readFile(this.cachePath, 'utf8')
      this.cache = JSON.parse(raw)
    } catch (err) {
      this.cache = { items: {} }
    }
    this.cacheLoaded = true
  }

  async persistCache() {
    if (!this.cachePath) return
    const payload = JSON.stringify(this.cache, null, 2)
    await writeFile(this.cachePath, payload, 'utf8')
  }
}

export default MessageChangeDetector
