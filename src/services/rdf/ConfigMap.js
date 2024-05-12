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
   */
  async execute(data, context) {

    const postcraftConfig = context.dataset
    // logger.log('postcraftConfig  = ' + postcraftConfig)

    const poi = grapoi({ dataset: postcraftConfig })
    //    logger.poi(poi)

    for (const q of poi.out(ns.rdf.type).quads()) {
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

    logger.log("§§§§§§§§§§ contentGroupID " + contentGroupID.value)

    switch (contentGroupID.value) { // TODO refactor
      case 'http://hyperdata.it/transmissions/PostContent':
        await this.markdownToPostContent(context, contentGroupID)
      case 'http://hyperdata.it/transmissions/PostPages':
        await this.postContentToPostPage(context, contentGroupID)
    }
  }

  async markdownToPostContent(context, contentGroupID) {
    // from services.ttl
    logger.log('############ ' + this.config.toString())
    const servicePoi = rdf.grapoi({ dataset: this.config, term: this.configKey })
    // logger.log("this.configKey " + this.configKey.value) // = t:markdownToRawPosts
    // logger.log(this.config.toString())
    const marker = servicePoi.out(ns.trm.marker).term
    //  logger.log("MARKER " + marker)


    logger.log('--- ConfigMap --- contentGroupID = ' + contentGroupID.value)
    const postcraftConfig = context.dataset

    // from manifest.ttl
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })
    // logger.log('---')
    //  logger.poi(groupPoi)
    // logger.log('---')
    const sourceDir = groupPoi.out(ns.fs.sourceDirectory).term.value
    const targetDir = groupPoi.out(ns.fs.targetDirectory).term.value
    const templateFilename = groupPoi.out(ns.pc.template).term.value

    //  logger.log('--- ConfigMap ---')
    logger.log('*****************+ sourceDir = ' + sourceDir)
    //  logger.log('targetDir = ' + targetDir)
    logger.log('templateFilename  = ' + templateFilename)

    context.sourceDir = sourceDir
    context.targetDir = targetDir
    context.loadContext = 'template'
    //    const templatePath = context.rootDir + '/' + templateFilename
    context.filepath = templateFilename
    context.template = '§§§ placeholer for debugging §§§'
  }

  async postContentToPostPage(context, contentGroupID) {
    logger.log('--- ConfigMap --- contentGroupID = ' + contentGroupID.value)

    // from services.ttl
    logger.log('############ ' + this.config.toString())
    const servicePoi = rdf.grapoi({ dataset: this.config, term: this.configKey })
    const postcraftConfig = context.dataset

    // from manifest.ttl
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })
    // logger.log('---')
    //  logger.poi(groupPoi)
    // logger.log('---')
    const sourceDir = groupPoi.out(ns.fs.sourceDirectory).term.value
    const targetDir = groupPoi.out(ns.fs.targetDirectory).term.value
    const templateFilename = groupPoi.out(ns.pc.template).term.value

    context.entryContentToPage = {
      sourceDir: sourceDir,
      targetDir: targetDir,
      templateFilename: templateFilename
    }

    /*
        logger.log('*****************+ sourceDir = ' + sourceDir)
        logger.log('templateFilename  = ' + templateFilename)
    
        context.sourceDir = sourceDir
        context.targetDir = targetDir
        context.loadContext = 'template'
        //    const templatePath = context.rootDir + '/' + templateFilename
        context.filepath = templateFilename
        context.template = '§§§ placeholer for debugging §§§'
        */
  }
}
export default ConfigMap