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


    // both place values in the context, save for later
    this.shredFilename(context)
    this.extractTitle(context)

    this.emit('message', false, context)
  }

  //  eg. 2024-04-19_hello-postcraft.md
  shredFilename(context) {
    const nonExt = context.filename.split('.').slice(0, -1).join()
    //  const nonExt = context.sourceFile.split('.').slice(0, -1).join()

    //  logger.log('nonExt = ' + nonExt)
    const shreds = nonExt.split('_')
    context.updated = (new Date()).toISOString().split('T')[0]
    context.created = context.updated // fallback
    if (Date.parse(shreds[0])) { // filename version is not NaN
      context.created = shreds[0]
    }
    context.title = shreds[1] // fallback
    context.targetFilename = context.rootDir + '/' + context.targetDir + '/' + context.title + '.html'
  }

  // first heading in the markdown else use filename
  extractTitle(context) {
    const data = context.content
    let match = data.toString().match(/^#(.*)$/m)
    let maybeTitle = match ? match[1].trim() : null
    if (maybeTitle) {
      context.title = maybeTitle
      return
    }

    // handle how I typically name files
    context.title = context.title.split('-') // split the string into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize the first letter of each word
      .join(' '); // join the words back together with spaces
  }
}

export default PostcraftPrep