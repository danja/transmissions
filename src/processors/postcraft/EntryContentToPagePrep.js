import path from 'path'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessProcessor from '../base/ProcessProcessor.js'

class EntryContentToPagePrep extends ProcessProcessor {

  constructor(config) {
    super(config)
  }

  async process(message) {
    if (message.done) {
      return this.emit('message', message)
      return
    }
    logger.setLogLevel('debug')

    // TODO path.join
    message.templateFilename = message.rootDir + '/' + message.entryContentToPage.templateFilename

    message.template = false

    message.contentBlocks.content = message.content

    if (message.entryContentToPage.targetDir.startsWith('/')) { // TODO unhacky!!
      message.filepath = path.join(message.entryContentToPage.targetDir, message.slug + '.html')
    } else {
      message.filepath = path.join(message.rootDir, message.entryContentToPage.targetDir, message.slug + '.html')
    }
    logger.debug('EntryContentToPagePrep, message.filepath = ' + message.filepath)

    this.emit('message', message)
  }

}

export default EntryContentToPagePrep