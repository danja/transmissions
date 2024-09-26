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

  async execute(message) {
    if (message.done) {
      this.emit('message', message)
      return
    }

    message.templateFilename = message.rootDir + '/' + message.entryContentToPage.templateFilename

    message.template = false

    message.contentBlocks.content = message.content

    message.filepath = message.rootDir + '/' + message.entryContentToPage.targetDir + '/' + message.slug + '.html'

    //   logger.log('\nmessage.filepath  = ' + message.filepath)
    // /home/danny/HKMS/postcraft/danny.ayers.name/layouts/mediocre
    this.emit('message', message)
  }

}

export default EntryContentToPagePrep