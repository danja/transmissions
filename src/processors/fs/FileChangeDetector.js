// src/processors/fs/FileChangeDetector.js
import { stat, readFile, writeFile } from 'node:fs/promises'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import JSONUtils from '../../utils/JSONUtils.js'
import Processor from '../../model/Processor.js'

/**
 * @class FileChangeDetector
 * @extends Processor
 * @classdesc
 * Skips processing for files that have not changed since the last run,
 * using a JSON cache of file mtimes.
 *
 * Settings:
 * - ns.trn.cacheFile: cache filename or path (default: ".md-to-sparqlstore-cache.json")
 * - ns.trn.pathField: message field containing file path (default: "fullPath")
 * - ns.trn.forceRebuild: when "true", bypass cache (default: "false")
 */
class FileChangeDetector extends Processor {
  constructor(config) {
    super(config)
    this.cacheLoaded = false
    this.cache = { files: {} }
    this.cachePath = null
  }

  async process(message) {
    if (message.done) {
      await this.persistCache().catch(err => {
        logger.warn(`FileChangeDetector: Failed to persist cache - ${err.message}`)
      })
      return this.emit('message', message)
    }

    await this.ensureCacheLoaded(message)

    const forceRebuild = this.getProperty(ns.trn.forceRebuild, 'false') === 'true'
    const pathField = this.getProperty(ns.trn.pathField, 'fullPath')
    const filePath = JSONUtils.get(message, pathField) || message.filePath || message.filepath

    if (!filePath) {
      logger.warn('FileChangeDetector: No file path found, skipping cache check')
      return this.emit('message', message)
    }

    let stats
    try {
      stats = await stat(filePath)
    } catch (err) {
      logger.warn(`FileChangeDetector: Cannot stat ${filePath} - ${err.message}`)
      return this.emit('message', message)
    }

    const mtimeMs = stats.mtimeMs
    const cached = this.cache.files[filePath]

    if (!forceRebuild && cached && cached === mtimeMs) {
      message.done = true
      message.skipped = true
      logger.debug(`FileChangeDetector: Unchanged, skipping ${filePath}`)
      return this.emit('message', message)
    }

    this.cache.files[filePath] = mtimeMs
    return this.emit('message', message)
  }

  async ensureCacheLoaded(message) {
    if (this.cacheLoaded) return
    const cacheFile = this.getProperty(ns.trn.cacheFile, '.md-to-sparqlstore-cache.json')
    const baseDir = message.targetDir || this.app.path || process.cwd()
    this.cachePath = path.isAbsolute(cacheFile) ? cacheFile : path.join(baseDir, cacheFile)
    try {
      const raw = await readFile(this.cachePath, 'utf8')
      this.cache = JSON.parse(raw)
    } catch (err) {
      this.cache = { files: {} }
    }
    this.cacheLoaded = true
  }

  async persistCache() {
    if (!this.cachePath) return
    const payload = JSON.stringify(this.cache, null, 2)
    await writeFile(this.cachePath, payload, 'utf8')
  }
}

export default FileChangeDetector
