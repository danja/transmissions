import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'

import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

/**
* Takes the message.dataset and guided by services.ttl maps its contents to direct key:value pairs in the message
* 
* #### __*Input*__
* **message** : needs dataset
* #### __*Output*__
* **message** : determined by mapping 
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
   * @param {Object} message - The message object.
   * TODO this desperately needs refactoring, generalising a bit 
  */
  async execute(message) {
    this.preProcess(message)
    //const postcraftConfig = message.dataset
    //logger.log(' = \n' + message.dataset)

    const dataset = message.dataset
    // logger.log('dataset   = ' + dataset)
    const poi = grapoi({ dataset, factory: rdf })
    //  logger.poi(poi)
    // logger.log(postcraftConfig)
    // const quads = poi.out(ns.rdf.type).quads()
    const quads = await poi.out(ns.rdf.type).quads()

    for (const q of quads) {
      // console.log(`QUAD ${q.subject.value} : ${q.predicate.value}: ${q.object.value} `)
      const type = q.object
      //     logger.log('type ' + type.value)

      if (type.equals(ns.pc.ContentGroup)) {
        //     logger.log('Q ' + q.subject.value)
        await this.processContentGroup(message, q.subject)
      }
    }
    //  process.exit()
    this.emit('message', message)
    // logger.log('ConfigMap message.templateFilename  = ' + message.templateFilename)
    // this.emit('message', message.templateFilename, message)
  }

  /**
   * Processes a content group.
   * @param {Object} message - The message object.
   * @param {string} contentGroupID - The ID of the content group.
   */

  async processContentGroup(message, contentGroupID) {

    // logger.log("Switching on contentGroupID " + contentGroupID.value)
    // logger.log('ns.trm.PostPages = ' + ns.t.PostPages.value)
    // logger.log('ns.trm.PostContent.toString() = ' + ns.trm.PostContent.toString())
    // if (contentGroupID.value === ns.t.PostPages.value) {
    // logger.log('MMMMMMMMMM')
    // }
    switch (contentGroupID.value) { // .value TODO refactor
      // case 'http://hyperdata.it/transmissions/PostContent':
      case ns.t.PostContent.value:
        //   logger.log('MATCHED PostContent')
        await this.markdownToEntryContent(message, contentGroupID)
        return
      case ns.t.PostPages.value:
        // case 'http://hyperdata.it/transmissions/PostPages':
        // logger.log('MATCHED PostPages')
        await this.entryContentToPostPage(message, contentGroupID)
        return
      case ns.t.IndexPage.value:
        //  case 'http://hyperdata.it/transmissions/IndexPage':
        //logger.log('MATCHED IndexPage')
        await this.indexPage(message, contentGroupID)
        return
      default:
        logger.log('Group not found in dataset :' + contentGroupID.value)
        return
    }
  }

  async markdownToEntryContent(message, contentGroupID) {


    //  logger.log('--- markdownToPostContent --- contentGroupID = ' + contentGroupID.value)

    // from services.ttl
    // const servicePoi = rdf.grapoi({ dataset: this.config, term: this.configKey })
    const postcraftConfig = message.dataset

    // from manifest.ttl
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })

    // TODO move earlier?
    const siteURL = groupPoi.out(ns.pc.site).term.value
    message.siteURL = siteURL
    const subdir = groupPoi.out(ns.pc.subdir).term.value
    message.subdir = subdir // which?

    const sourceDir = groupPoi.out(ns.fs.sourceDirectory).term.value
    const targetDir = groupPoi.out(ns.fs.targetDirectory).term.value
    const templateFilename = groupPoi.out(ns.pc.template).term.value

    // message.sourceDir = sourceDir
    // message.targetDir = targetDir
    // message.loadContext = 'template' 
    message.filepath = templateFilename
    message.template = '§§§ placeholer for debugging §§§'

    message.entryContentMeta = {
      sourceDir: sourceDir,
      targetDir: targetDir,
      templateFilename: templateFilename
    }
  }

  async entryContentToPostPage(message, contentGroupID) {
    //logger.log('--- entryContentToPostPage--- contentGroupID = ' + contentGroupID.value)

    // from services.ttl
    //  logger.log('############ ' + this.config.toString())
    //const servicePoi = rdf.grapoi({ dataset: this.config, term: this.configKey })
    const postcraftConfig = message.dataset

    // from manifest.ttl
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })
    //   const sourceDir = groupPoi.out(ns.fs.sourceDirectory).term.value
    const targetDir = groupPoi.out(ns.fs.targetDirectory).term.value
    const templateFilename = groupPoi.out(ns.pc.template).term.value

    message.entryContentToPage = {
      // sourceDir: sourceDir,
      targetDir: targetDir,
      templateFilename: templateFilename
    }
  }

  async indexPage(message, contentGroupID) {
    // logger.log('Indexpage --- contentGroupID = ' + contentGroupID.value)

    // from services.ttl
    //  logger.log('############ ' + this.config.toString())
    // const servicePoi = rdf.grapoi({ dataset: this.config, term: this.configKey })
    const postcraftConfig = message.dataset

    // from manifest.ttl
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })

    const quads = await groupPoi.out().quads()
    for (const q of quads) {
      //   console.log(`QQ ${q.subject.value} : ${q.predicate.value}: ${q.object.value} `)
    }
    //   const sourceDir = groupPoi.out(ns.fs.sourceDirectory).term.value
    const filepath = groupPoi.out(ns.fs.filepath).term.value
    const templateFilename = groupPoi.out(ns.pc.template).term.value

    message.indexPage = {
      // sourceDir: sourceDir,
      filepath: filepath,
      templateFilename: templateFilename
    }
  }
}
export default ConfigMap