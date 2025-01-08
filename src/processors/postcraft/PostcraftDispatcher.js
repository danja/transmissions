//// UNUSED

import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

/**
 * A class that represents the PostcraftDispatcher processor.
* #### __*Input*__
* **data** : any
* **message** : needs dataset
* #### __*Output*__
* **data** : templateFilename
* **message** : adds sourceDir, targetDir, templateFilename
* @extends Processor
*/
class PostcraftDispatcher extends Processor {

  /**
   * Creates an instance of PostcraftDispatcher.
   * @param {Object} config - The configuration object.
   */
  constructor(config) {
    super(config)
  }

  /**
   * Executes the PostcraftDispatcher processor.
   * @param {Object} data - The data object.
   * @param {Object} message - The message object.
   */
  async process(message) {
    //  logger.setLogLevel('debug')
    const postcraftConfig = message.dataset
    message.template = data.toString()
    logger.debug('PostcraftDispatcherPostcraftDispatcherPostcraftDispatcher ' + data)
    process.exit(0)
    const poi = grapoi({ dataset: postcraftConfig })

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.pc.ContentGroup)) {
        await this.processContentGroup(message, q.subject)
      }
    }
  }

  /**
   * Processes a content group.
   * @param {Object} message - The message object.
   * @param {string} contentGroupID - The ID of the content group.
   */
  async processContentGroup(message, contentGroupID) {
    const postcraftConfig = message.dataset
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })
    const sourceDir = groupPoi.out(ns.fs.sourceDirectory).term.value
    const targetDir = groupPoi.out(ns.fs.targetDirectory).term.value
    const templateFilename = groupPoi.out(ns.pc.template).term.value

    // logger.log('sourceDir = ' + sourceDir)
    // logger.log('targetDir = ' + targetDir)
    // logger.log('templateFilename  = ' + templateFilename)

    message.sourceDir = sourceDir
    message.targetDir = targetDir
    message.templateFilename = templateFilename
    message.loadContext = 'template'

    return this.emit('message', sourceDir, message)
  }
}

export default PostcraftDispatcher