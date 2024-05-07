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
    // context.template = context.template.toString()

    context.contentBlocks = {}
    context.contentBlocks.content = context.content

    // both place values in the context, save for later
    this.shredFilename(context)
    logger.log('1 TITLE context.contentBlocks.title ' + context.contentBlocks.title)
    this.extractTitle(context)
    logger.log('2 TITLE context.contentBlocks.title ' + context.contentBlocks.title)

    //  logger.log('FILENAME ' + context.filename)
    logger.log('TARGET FILENAME ' + context.targetFilename)
    // logger.log('TARGET FILENAME context.contentBlocks.title ' + context.targetFilename)
    this.emit('message', false, context)
  }

  //  eg. 2024-04-19_hello-postcraft.md
  shredFilename(context) {
    const nonExt = context.filename.split('.').slice(0, -1).join()
    //  const nonExt = context.sourceFile.split('.').slice(0, -1).join()

    //  logger.log('nonExt = ' + nonExt)
    const shreds = nonExt.split('_')

    const updated = (new Date()).toISOString().split('T')[0]
    const created = context.updated // fallback
    if (Date.parse(shreds[0])) { // filename version is not NaN
      context.created = shreds[0]
    }

    // context.contentBlocks.
    context.contentBlocks.title = shreds[1] // fallback

    const link = context.targetDir + '/' + context.contentBlocks.title + '.html' // TODO needs final dir

    context.targetFilename = context.rootDir + '/' + context.targetDir + '/' + context.contentBlocks.title + '.html'
    logger.log('sdfsdf TARGET FILENAME ' + context.targetFilename)
    context.contentBlocks.updated = updated
    context.contentBlocks.created = created

    // context.contentBlocks.title = shreds[1] // fallback

    context.contentBlocks.link = link
  }

  // first heading in the markdown else use filename
  extractTitle(context) {
    //   const data = context.content
    let match = context.content.toString().match(/^#(.*)$/m)
    let title = match ? match[1].trim() : null

    if (!title) {  // use how I typically name files
      context.contentBlocks.title = context.title.split('-') // split the string into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize the first letter of each word
        .join(' '); // join the words back together with spaces
    }
    title = title.replaceAll('#', '') // TODO make nicer
    context.contentBlocks.title = title
  }
}

export default PostcraftPrep