import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import Processor from '../../model/Processor.js'

// src/processors/postcraft/MakeEntry.js

/**
 * @class MakeEntry
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Generates entry metadata and paths for a given message, extracting dates and computing relative/slug paths for post-processing workflows.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * None specific (uses message fields and config for logic)
 *
 * #### __*Input*__
 * * **`message`** - The message object containing file and path info
 *
 * #### __*Output*__
 * * **`message`** - The message object with computed entry metadata (e.g., rel, slug, dates)
 *
 * #### __*Behavior*__
 * * Extracts dates from the message
 * * Computes relative and slug paths for the entry
 * * Emits the updated message
 * * Logs key actions for debugging
 *
 * #### __*Side Effects*__
 * * Mutates the message object in place
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Refactor to remove hacky logic
 * * Add tests for various path/date scenarios
 */

class MakeEntry extends Processor {

  constructor(config) {
    super(config)
    // logger.debug('MakeEntry constructor config:', config)
  }

  async process(message) {
    logger.debug(`\n\n[MakeEntry.process]`)
    if (message.done) {
      return this.emit('message', message)
    }
    const dates = this.extractDates(message)

    // rootDir
    // let basePath = message.targetPath || message.sourceDir || process.cwd()
    //if (!basePath) basePath = process.cwd()


    var { rel, slug } = this.extractRelSlug(message.targetDir, message.filePath)
    logger.log(`    message.targetDir = ${message.targetDir}`)
    logger.log(`    message.filePath = ${message.filePath}`)
    logger.log(`    rel = ${rel}`)
    logger.log(`    slug = ${slug}`)

    const rawDir = super.getProperty(ns.trn.rawDir, '') // eg. content/raw
    const renderPath = super.getProperty(ns.trn.renderPath, '') // eg. docs

    rel = rel.replace(rawDir, renderPath)
    logger.debug(`renderPath = ${renderPath}`)
    const newPath = path.join(rel, slug)

    logger.log(`newPath = ${newPath}`)

    //  message.filePath = newPath

    logger.debug(`message.meta.filepath = ${message.meta.filepath}`)
    logger.debug(`slug = ${slug}`)

    //    var uri = this.getEntryURI(rel, slug)
    const uri = super.getProperty(ns.trn.baseURI, 'http://example.it') + newPath
    // uri = 'http:/' + uri

    let relative = rel

    const title = this.extractTitle(message)

    message.contentBlocks = {
      uri: uri,
      sourcePath: message.meta.filepath,
      mediaType: message.meta.mediaType,
      relative: relative,
      // relPath: rel,
      // relMap: relMap,
      title: title,
      content: message.content,
      slug: slug,
      dates: dates,
      creator: this.getCreator()
    }
    logger.log(` - made entry : ${uri}`)
    return this.emit('message', message)
  }

  getEntryURI(rel, slug) {
    const baseURI = super.getProperty(ns.trn.baseURI, '')
    logger.debug(`getEntryURI: baseURI = ${baseURI}`)
    return baseURI + '/' + rel + '/' + slug
  }

  getCreator() {
    const creatorName = super.getProperty(ns.trn.creatorName, '')
    const creatorURI = super.getProperty(ns.trn.creatorURI, '')
    logger.debug(`getCreator: creatorName = ${creatorName}, creatorURI = ${creatorURI}`)
    return {
      name: creatorName,
      uri: creatorURI
    }
  }

  // filePath - appPath
  // (message.sourceDir, dates, message.filePath)
  extractRelSlug(basePath, filePath) {
    logger.debug(`MakeEntry.extractRelSlug`)
    logger.debug(`basePath = ${basePath}`)
    logger.debug(`filePath = ${filePath}`)

    const baseLength = basePath.split(path.sep).length
    const split = filePath.split(path.sep)
    const splitLength = split.length

    logger.debug(`split = ${split}`)

    var slug = split.slice(splitLength - 1).toString()
    if (slug.includes('.')) {
      slug = slug.substr(0, slug.lastIndexOf('.'))
    }

    logger.debug(`slug = ${slug}`)
    logger.debug(`baseLength = ${baseLength}, splitLength = ${splitLength}`)

    const dirs = split.slice(baseLength, splitLength - 1)

    logger.debug(`dirs = ${dirs}`)

    /* TODO make this an option
    const day = dates.created.split('T')[0]
    const rel = path.join(dirs.join(path.sep), day)
    */
    const rel = dirs.join(path.sep)
    logger.debug(`rel = ${rel}`)
    return { rel, slug }
  }

  extractDates(message) {
    const now = (new Date()).toISOString()
    // TODO make note - FileReader gives date object
    const created = message.meta.created.toISOString()
    const modified = message.meta.modified.toISOString()
    const dates = {
      read: now,
      created: created,
      modified: modified
    }

    //  eg. 2024-04-19_hello-postcraft.md
    const nonExt = message.filePath.split('.').slice(0, -1).join()
    const shreds = nonExt.split('_')
    //if (Date.parse(shreds[0])) { // filename version is not NaN
    //dates.created = shreds[0]
    //}
    return dates
  }

  // first heading in the markdown
  // or formatted from filename
  // or raw filename
  extractTitle(message) {
    let title = 'Title'
    let match = message.content.toString().match(/^#(.*)$/m)
    let contentTitle = match ? match[1].trim() : null
    if (contentTitle) {
      title = contentTitle.replaceAll('#', '') // TODO make nicer
      return title
    }

    // derive from filename
    // eg. 2024-04-19_hello-postcraft.md
    try {
      const nonExt = message.filename.split('.').slice(0, -1).join()
      const shreds = nonExt.split('_')

      // let title = shreds[1] // fallback, get it from filename
      title = shreds[1].split('-') // split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize the first letter of each word
        .join(' ') // join the words back together with spaces
    } catch (err) {
      title = message.filename
    }
    return title
  }
}

export default MakeEntry