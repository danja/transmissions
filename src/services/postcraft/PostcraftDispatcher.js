import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class PostcraftDispatcher extends ProcessService {

  constructor(config) {
    super(config)
  }

  async execute(data, context) {
    const postcraftConfig = context.dataset
    const poi = grapoi({ dataset: postcraftConfig })

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.pc.ContentGroup)) { // 
        logger.debug("about to build pipeline")
        this.processContentGroup(postcraftConfig, q.subject)
      }
    }

    this.emit('message', data, context)

  }

  processContentGroup(context, contentGroupID) {

    const groupPoi = rdf.grapoi({ dataset: context, term: contentGroupID })
    const sourceDir = groupPoi.out(ns.fs.sourceDirectory).term.value
    const targetDir = groupPoi.out(ns.fs.targetDirectory).term.value
    const template = groupPoi.out(ns.pc.template).term.value

    logger.log('sourceDir = ' + sourceDir)
    logger.log('targetDir = ' + targetDir)
    logger.log('template  = ' + template)

  }
}

export default PostcraftDispatcher