//// UNUSED

import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

/**
 * A class that represents the PostcraftDispatcher service.
* #### __*Input*__
* **data** : any
* **context** : needs dataset
* #### __*Output*__
* **data** : templateFilename
* **context** : adds sourceDir, targetDir, templateFilename
* @extends ProcessService
*/
class PostcraftDispatcher extends ProcessService {

  /**
   * Creates an instance of PostcraftDispatcher.
   * @param {Object} config - The configuration object.
   */
  constructor(config) {
    super(config)
  }

  /**
   * Executes the PostcraftDispatcher service.
   * @param {Object} data - The data object.
   * @param {Object} context - The context object.
   */
  async execute(data, context) {
    const postcraftConfig = context.dataset
    context.template = data.toString()
    logger.log('PostcraftDispatcherPostcraftDispatcherPostcraftDispatcher ' + data)
    const poi = grapoi({ dataset: postcraftConfig })

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.pc.ContentGroup)) {
        await this.processContentGroup(context, q.subject)
      }
    }
  }

  /**
   * Processes a content group.
   * @param {Object} context - The context object.
   * @param {string} contentGroupID - The ID of the content group.
   */
  async processContentGroup(context, contentGroupID) {
    const postcraftConfig = context.dataset
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })
    const sourceDir = groupPoi.out(ns.fs.sourceDirectory).term.value
    const targetDir = groupPoi.out(ns.fs.targetDirectory).term.value
    const templateFilename = groupPoi.out(ns.pc.template).term.value

    logger.log('sourceDir = ' + sourceDir)
    logger.log('targetDir = ' + targetDir)
    logger.log('templateFilename  = ' + templateFilename)

    context.sourceDir = sourceDir
    context.targetDir = targetDir
    context.templateFilename = templateFilename
    context.loadContext = 'template'

    this.emit('message', sourceDir, context)
  }
}

export default PostcraftDispatcher