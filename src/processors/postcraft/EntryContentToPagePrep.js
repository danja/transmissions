import path from 'path'
import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class EntryContentToPagePrep extends Processor {

  constructor(config) {
    super(config)
  }

  async process(message) {
    if (message.done) {
      return this.emit('message', message)
      return
    }
    logger.setLogLevel('debug')

    logger.reveal(message)

    /*
        if (message.targetPath) {
          message.templateFilename = path.join(message.targetPath, message.entryContentToPage.templateFilename)
        } else {
          message.templateFilename = path.join(message.rootDir, message.entryContentToPage.templateFilename)
        }
    
        logger.log("################ message.templateFilename = " + message.templateFilename)
    
        message.template = false // ???????????
    */
    message.contentBlocks.content = message.content
    logger.reveal(message)
    if (path.isAbsolute(message.targetDir)) {
      message.filepath = path.join(message.targetDir, message.slug + '.html')
    } else {
      if (message.targetPath) {
        message.filepath = path.join(message.targetPath, message.targetDir, message.slug + '.html')
      } else {
        message.filepath = path.join(message.rootDir, message.targetDir, message.slug + '.html')
      }

    }
    logger.debug('EntryContentToPagePrep, message.filepath = ' + message.filepath)

    this.emit('message', message)
  }

}

export default EntryContentToPagePrep