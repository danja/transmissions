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
* **context** : needs dataset
* #### __*Output*__
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
   * TODO this desperately needs refactoring, generalising a bit 
  */
  async execute(data, context) {

    const postcraftConfig = context.dataset
    // logger.log('postcraftConfig  = ' + postcraftConfig)

    const poi = grapoi({ dataset: postcraftConfig })
    //    logger.poi(poi)
    const quads = await poi.out(ns.rdf.type).quads()

    for (const q of quads) { ///////// WRONG ITERATOR????????????
      logger.log('\nq.object.value = ' + q.object.value)
      logger.log('q.subject.value = ' + q.subject.value)
      if (q.object.equals(ns.pc.ContentGroup)) {

        await this.processContentGroup(context, q.subject)
      }
    }

    this.emit('message', false, context)
    // logger.log('ConfigMap context.templateFilename  = ' + context.templateFilename)
    // this.emit('message', context.templateFilename, context)
  }

  /**
   * Processes a content group.
   * @param {Object} context - The context object.
   * @param {string} contentGroupID - The ID of the content group.
   */

  async processContentGroup(context, contentGroupID) {

    // logger.log("Switching on contentGroupID " + contentGroupID.value)
    // logger.log('ns.trm.PostPages = ' + ns.t.PostPages.value)
    // logger.log('ns.trm.PostContent.toString() = ' + ns.trm.PostContent.toString())
    // if (contentGroupID.value === ns.t.PostPages.value) {
    // logger.log('MMMMMMMMMM')
    // }
    switch (contentGroupID.value) { // .value TODO refactor
      // case 'http://hyperdata.it/transmissions/PostContent':
      case ns.t.PostContent.value:
        logger.log('MATCHED PostContent')
        await this.markdownToPostContent(context, contentGroupID)

      case ns.t.PostPages.value:
        // case 'http://hyperdata.it/transmissions/PostPages':
        logger.log('MATCHED PostPages')
        await this.entryContentToPostPage(context, contentGroupID)

      case ns.t.IndexPage.value:
        //  case 'http://hyperdata.it/transmissions/IndexPage':
        logger.log('MATCHED IndexPage')

        await this.indexPage(context, contentGroupID)

      default:
        logger.log('group not found')
        return
    }
  }

  async markdownToPostContent(context, contentGroupID) {
    logger.log('--- markdownToPostContent --- contentGroupID = ' + contentGroupID.value)

    // from services.ttl
    const servicePoi = rdf.grapoi({ dataset: this.config, term: this.configKey })
    const postcraftConfig = context.dataset

    // from manifest.ttl
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })

    // TODO move earlier?
    const siteURL = groupPoi.out(ns.pc.site).term.value
    context.siteURL = siteURL
    const subdir = groupPoi.out(ns.pc.subdir).term.value
    context.subdir = subdir

    const sourceDir = groupPoi.out(ns.fs.sourceDirectory).term.value
    const targetDir = groupPoi.out(ns.fs.targetDirectory).term.value
    const templateFilename = groupPoi.out(ns.pc.template).term.value

    context.sourceDir = sourceDir
    context.targetDir = targetDir
    context.loadContext = 'template'
    context.filepath = templateFilename
    context.template = '§§§ placeholer for debugging §§§'
  }

  async entryContentToPostPage(context, contentGroupID) {
    logger.log('--- entryContentToPostPage--- contentGroupID = ' + contentGroupID.value)

    // from services.ttl
    //  logger.log('############ ' + this.config.toString())
    const servicePoi = rdf.grapoi({ dataset: this.config, term: this.configKey })
    const postcraftConfig = context.dataset

    // from manifest.ttl
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })
    //   const sourceDir = groupPoi.out(ns.fs.sourceDirectory).term.value
    const targetDir = groupPoi.out(ns.fs.targetDirectory).term.value
    const templateFilename = groupPoi.out(ns.pc.template).term.value

    context.entryContentToPage = {
      // sourceDir: sourceDir,
      targetDir: targetDir,
      templateFilename: templateFilename
    }
  }

  async indexPage(context, contentGroupID) {
    logger.log('--- Indexpage --- contentGroupID = ' + contentGroupID.value)

    // from services.ttl
    //  logger.log('############ ' + this.config.toString())
    const servicePoi = rdf.grapoi({ dataset: this.config, term: this.configKey })
    const postcraftConfig = context.dataset

    // from manifest.ttl
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })
    //   const sourceDir = groupPoi.out(ns.fs.sourceDirectory).term.value
    const filepath = groupPoi.out(ns.fs.filepath).term.value
    const templateFilename = groupPoi.out(ns.pc.template).term.value

    context.indexPage = {
      // sourceDir: sourceDir,
      filepath: filepath,
      templateFilename: templateFilename
    }
  }
}
export default ConfigMap