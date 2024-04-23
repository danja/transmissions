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
    const targetFilename = this.extractTargetFilename(data, context)
    const title = this.extractTitle(data, context)
    /*
    const postcraftConfig = context.dataset
    const poi = grapoi({ dataset: postcraftConfig })
 
    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.pc.ContentGroup)) { // 
        logger.debug("about to build pipeline")
        await this.processContentGroup(context, q.subject)
      }
    }
*/
    this.emit('message', this.doneMessage, context)
  }

  extractTargetFilename(data, context) {

  }

  // first heading in the markdown else use filename
  extractTitle(data, context) {

  }
}

export default PostcraftPrep