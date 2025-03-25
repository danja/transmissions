import path from 'path'
import logger from '../../utils/Logger.js'

import Processor from '../../model/Processor.js'

class PostcraftPrep extends Processor {

  constructor(config) {
    super(config)
  }

  async process(message) {
    //  logger.setLogLevel("debug")

    if (message.done) {
      return this.emit('message', message)
    }
    message.slug = this.extractSlug(message)
    message.targetFilename = this.extractTargetFilename(message)
    message.contentBlocks = {}
    message.contentBlocks.relURL = this.extractRelURL(message)

    // TODO generalise - use path.join
    message.contentBlocks.link = 'entries/' + message.contentBlocks.relURL

    message.contentBlocks.title = this.extractTitle(message)

    const { created, updated } = this.extractDates(message)
    message.contentBlocks.created = created
    message.contentBlocks.updated = updated

    return this.emit('message', message)
  }

  // TODO lots of tidying up
  extractSlug(message) { // TODO move this into a utils file - is also in DirWalker

    var slug = message.filename
    // logger.reveal(message)
    if (slug.includes('.')) {
      slug = slug.substr(0, slug.lastIndexOf("."))
    }
    return slug
  }

  extractTargetFilename(message) {


    /*
    if (message.targetPath) {
      return path.join(message.targetPath, message.entryContentMeta.targetDir, this.extractSlug(message) + '.html')
    } else {
      return path.join(message.rootDir, message.entryContentMeta.targetDir, this.extractSlug(message) + '.html')
    }
*/
    logger.reveal(message)

    /*
    if (message.targetPath) {
      return path.join(message.targetPath, message.targetDir, this.extractSlug(message) + '.html')
    } else {
      return path.join(message.rootDir, message.targetDir, this.extractSlug(message) + '.html')
    }
      */
    return path.join(message.contentGroup.PostPages.targetDir, this.extractSlug(message) + '.html')
  }

  extractRelURL(message) { // TODO refactor
    return this.extractSlug(message) + '.html'
  }

  extractDates(message) {
    const today = (new Date()).toISOString().split('T')[0]
    const dates = { created: today, updated: today }

    //  eg. 2024-04-19_hello-postcraft.md
    const nonExt = message.filename.split('.').slice(0, -1).join()
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

export default PostcraftPrep