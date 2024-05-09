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

    // context.template = context.template.toString()

    context.contentBlocks = {}
    context.contentBlocks.content = context.content

    // const link = context.targetDir + '/' + context.contentBlocks.title + '.html' // TODO needs final dir
    //context.targetFilename = context.rootDir + '/' + context.targetDir + '/' + context.contentBlocks.title + '.html'
    //context.contentBlocks.link = link

    const { created, updated } = this.extractDates(context)
    const title = this.extractTitle(context)
    context.contentBlocks.title = title
    context.contentBlocks.created = created
    context.contentBlocks.updated = updated
    this.emit('message', false, context)
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