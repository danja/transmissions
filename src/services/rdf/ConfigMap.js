import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

/**
* Takes the context.dataset and guided by services.ttl maps its contents to direct key:value pairs in the context
* 
* #### __*Input*__
* **data** : any
* **context** : needs dataset
* #### __*Output*__
* **data** : determined by mapping
* **context** : determined by mapping 
* @extends ProcessService
*/
class ConfigMap extends ProcessService {

  /**
   * Creates an instance of PostcraftDispatcher.
   * @param {Object} config - The configuration object.
   */
  constructor(config) {
    super(config)
  }

  /**
   * Executes the service.
   * @param {Object} data - The data object.
   * @param {Object} context - The context object.
   */
  async execute(data, context) {

    const postcraftConfig = context.dataset
    const poi = grapoi({ dataset: postcraftConfig })

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.pc.ContentGroup)) {
        await this.processContentGroup(context, q.subject)
      }
    }

    // logger.log('ConfigMap context.templateFilename  = ' + context.templateFilename)
    // this.emit('message', context.templateFilename, context)
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
    //  context.templateFilename = templateFilename
    context.loadContext = 'template'
    const templatePath = context.rootDir + '/' + templateFilename
    context.template = '§§§ placeholer for debugging §§§'
    this.emit('message', templatePath, context)
  }

}
export default ConfigMap