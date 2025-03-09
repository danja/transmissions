import path from 'path'
import crypto from 'crypto'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

import Processor from '../../model/Processor.js'

class MakeEntry extends Processor {

  constructor(config) {
    super(config)
  }

  async process(message) {

    if (message.done) {
      return this.emit('message', message)
    }
    const dates = this.extractDates(message)
    const { rel, slug } = this.extractRelSlug(message.sourceDir, dates, message.filePath)

    logger.trace(`message.meta.filepath = ${message.meta.filepath}`)
    logger.trace(`slug = ${slug}`)

    const uri = this.getEntryURI(rel, slug)
    message.contentBlocks = {
      uri: uri,
      sourcePath: message.meta.filepath,
      mediaType: message.meta.mediaType,
      relPath: rel,
      content: message.content,
      slug: slug,
      title: this.extractTitle(message),
      dates: dates,
      creator: this.getCreator()
    }
    logger.log(` - made entry : ${uri}`)
    return this.emit('message', message)
  }

  getEntryURI(rel, slug) {
    const baseURI = super.getProperty(ns.trn.baseURI)
    //  const id = crypto.randomUUID()
    return path.join(baseURI, rel, slug)
  }

  getCreator() {
    return {
      name: super.getProperty(ns.trn.creatorName),
      uri: super.getProperty(ns.trn.creatorURI)
    }
  }

  // filePath - appPath
  extractRelSlug(basePath, dates, filePath) {
    logger.trace(`\nMakeEntry.extractRelSlug`)
    logger.trace(`basePath = ${basePath}`)
    const baseLength = basePath.split(path.sep).length
    const split = filePath.split(path.sep)
    const splitLength = split.length
    logger.trace(`split = ${split}`)
    var slug = split.slice(splitLength - 1).toString()
    if (slug.includes('.')) {
      slug = slug.substr(0, slug.lastIndexOf('.'))
    }
    logger.trace(`slug = ${slug}`)
    logger.trace(`baseLength = ${baseLength}, splitLength = ${splitLength}`)
    const dirs = split.slice(baseLength, splitLength - 1)
    logger.trace(`dirs = ${dirs}`)

    /* TODO make this an option
    const day = dates.created.split('T')[0]
    const rel = path.join(dirs.join(path.sep), day)
    */
    const rel = dirs.join(path.sep)
    logger.trace(`rel = ${rel}`)
    return { rel, slug }
  }

  extractDates(message) {
    const now = (new Date()).toISOString().split('.')[0]
    // TODO make note - FileReader gives date object
    const created = message.meta.created.toISOString().split('.')[0]
    const updated = message.meta.updated
    const dates = {
      read: now,
      created: created,
      updated: updated
    }

    //  eg. 2024-04-19_hello-postcraft.md
    const nonExt = message.filePath.split('.').slice(0, -1).join()
    const shreds = nonExt.split('_')
    if (Date.parse(shreds[0])) { // filename version is not NaN
      dates.created = shreds[0]
    }
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