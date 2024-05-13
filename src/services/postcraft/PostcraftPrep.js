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

  async execute(data, context) {
    if (context.done) {
      this.emit('message', false, context)
      return
    }
    // logger.log('----------BEFORE------------')
    // logger.reveal(context)

    context.slug = this.extractSlug(context)
    context.targetFilename = this.extractTargetFilename(context) + '.html'

    context.contentBlocks = {}
    // context.contentBlocks.content = context.content

    // context.subdir = this.extractSubdir(context)
    context.contentBlocks.relURL = this.extractRelURL(context)
    context.contentBlocks.link = context.siteURL + '/' + context.contentBlocks.relURL
    context.contentBlocks.title = this.extractTitle(context)

    const { created, updated } = this.extractDates(context)
    context.contentBlocks.created = created
    context.contentBlocks.updated = updated

    // logger.log('----------AFTER------------')
    // logger.reveal(context)
    //process.exit(0)
    this.emit('message', false, context)
  }

  // TODO lots of tidying up
  extractSlug(context) {
    var slug = context.filename
    if (slug.includes('.')) {
      slug = slug.substr(0, slug.lastIndexOf("."))
    }
    return slug
  }

  extractTargetFilename(context) {
    return context.rootDir + '/' + context.targetDir + '/' + this.extractSlug(context)
    /*
        AssertionError: expected '/root//target/2024-05-10_hello-postcr…' to equal '/root/target/2024-05-10_hello-postcra…'
     */
  }

  extractRelURL(context) {
    return context.subdir + '/' + this.extractSlug(context) + '.html'
    /*
    AssertionError: expected 'target/2024-05-10_hello-postcraft.html' to equal '/target/2024-05-10_hello-postcraft.ht…'
    */
  }

  extractDates(context) {
    const today = (new Date()).toISOString().split('T')[0]
    const dates = { created: today, updated: today }

    //  eg. 2024-04-19_hello-postcraft.md
    const nonExt = context.filename.split('.').slice(0, -1).join()
    const shreds = nonExt.split('_')
    if (Date.parse(shreds[0])) { // filename version is not NaN
      dates.created = shreds[0]
    }
    return dates
  }

  // first heading in the markdown 
  // or formatted from filename
  // or raw filename
  extractTitle(context) {
    let title = 'Title'
    let match = context.content.toString().match(/^#(.*)$/m)
    let contentTitle = match ? match[1].trim() : null
    if (contentTitle) {
      title = contentTitle.replaceAll('#', '') // TODO make nicer
      return title
    }

    // derive from filename
    // eg. 2024-04-19_hello-postcraft.md
    try {
      const nonExt = context.filename.split('.').slice(0, -1).join()
      const shreds = nonExt.split('_')

      // let title = shreds[1] // fallback, get it from filename
      title = shreds[1].split('-') // split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize the first letter of each word
        .join(' '); // join the words back together with spaces
    } catch (err) {
      title = context.filename
    }
    return title
  }
}

export default PostcraftPrep