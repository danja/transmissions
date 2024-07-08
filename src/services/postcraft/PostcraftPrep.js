import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class PostcraftPrep extends ProcessService {

  constructor(config) {
    super(config)
  }

  async execute(message) {
    // this.preProcess(message)
    // logger.log('----------BEFORE------------')
    // logger.reveal(message)

    message.slug = this.extractSlug(message)
    message.targetFilename = this.extractTargetFilename(message) + '.html'

    message.contentBlocks = {}
    // message.contentBlocks.content = message.content

    // message.subdir = this.extractSubdir(message)
    message.contentBlocks.relURL = this.extractRelURL(message)
    message.contentBlocks.link = message.siteURL + '/' + message.contentBlocks.relURL
    message.contentBlocks.title = this.extractTitle(message)

    const { created, updated } = this.extractDates(message)
    message.contentBlocks.created = created
    message.contentBlocks.updated = updated

    // logger.log('----------AFTER------------')
    // logger.reveal(message)
    //process.exit(0)
    this.emit('message', message)
  }

  // TODO lots of tidying up
  extractSlug(message) { // TODO move this into a utils file - is also in DirWalker
    var slug = message.filename
    if (slug.includes('.')) {
      slug = slug.substr(0, slug.lastIndexOf("."))
    }
    return slug
  }

  extractTargetFilename(message) {
    return message.rootDir + '/' + message.entryContentMeta.targetDir + '/' + this.extractSlug(message)
    /*
        AssertionError: expected '/root//target/2024-05-10_hello-postcr…' to equal '/root/target/2024-05-10_hello-postcra…'
     */
  }

  extractRelURL(message) {
    return message.subdir + '/' + this.extractSlug(message) + '.html'
    /*
    AssertionError: expected 'target/2024-05-10_hello-postcraft.html' to equal '/target/2024-05-10_hello-postcraft.ht…'
    */
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
        .join(' '); // join the words back together with spaces
    } catch (err) {
      title = message.filename
    }
    return title
  }
}

export default PostcraftPrep