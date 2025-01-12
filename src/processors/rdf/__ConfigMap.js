// src/processors/rdf/ConfigMap.js
/**
 * @class ConfigMap
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Maps RDF dataset contents to key-value pairs in the message object based on config.ttl
 *
 * ### Signature
 *
 * #### __*Input*__
 * * **`message.dataset`** - RDF dataset containing configuration
 *
 * #### __*Output*__
 * * **`message`** - Updated with mapped key-value pairs based on the dataset content
 *
 * #### __*Behavior*__
 * * Processes the RDF dataset in the message
 * * Identifies and processes different content groups (PostContent, PostPages, IndexPage)
 * * Maps relevant information to specific message properties
 *
 * #### __Tests__
 * * TODO: Add test information
 */

import ns from '../../utils/ns.js'
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class ConfigMap extends Processor {
  constructor(config) {
    super(config)
  }

  /**
   * Executes the ConfigMap processor
   * @param {Object} message - The message object containing the dataset
   * @todo Refactor for better generalization and maintainability
   */
  async process(message) {
    //  logger.setLogLevel('debug')

    logger.debug(`ConfigMap, Using configKey ${this.settings.value}`)

    const group = this.getPropertyFromMyConfig(ns.trn.group)
    const targetGroup = rdf.namedNode(group)
    logger.debug(`ConfigMap, group =  ${targetGroup}`)

    // source = path.join(message.rootDir, source);

    this.preProcess(message)
    const dataset = message.dataset
    const poi = grapoi({ dataset, factory: rdf })
    const quads = await poi.out(ns.rdf.type).quads()

    for (const q of quads) {
      const type = q.object
      //   logger.debug('type = ' + type.value)
      // logger.debug('targetGroup = ' + targetGroup)
      if (type.equals(targetGroup)) {
        //          if (type.equals(ns.trn.ContentGroup)) {
        await this.processContentGroup(message, q.subject)
      }
    }

    return this.emit('message', message)
  }

  /**
   * Processes a content group based on its type
   * @param {Object} message - The message object
   * @param {Object} contentGroupID - The ID of the content group
   */
  async processContentGroup(message, contentGroupID) {
    logger.debug('contentGroupID = ' + contentGroupID.value)
    switch (contentGroupID.value) {
      case ns.trn.PostContent.value:
        await this.markdownToEntryContent(message, contentGroupID)
        break
      case ns.trn.PostPages.value:
        await this.entryContentToPostPage(message, contentGroupID)
        break
      case ns.trn.IndexPage.value:
        await this.indexPage(message, contentGroupID)
        break
      case ns.trn.AtomFeed.value:
        await this.atomFeed(message, contentGroupID)
        break
      default:
        logger.log('Group not found in dataset: ' + contentGroupID.value)
    }
  }

  /**
   * Processes markdown to entry content
   * @param {Object} message - The message object
   * @param {Object} contentGroupID - The ID of the content group
   */
  async markdownToEntryContent(message, contentGroupID) {
    const postcraftConfig = message.dataset
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })

    // message.location = groupPoi.out(ns.trn.location).term.value
    // message.subdir = groupPoi.out(ns.trn.subdir).term.value
    message.filepath = groupPoi.out(ns.trn.template).term.value
    message.template = '§§§ placeholer for debugging §§§'

    message.entryContentMeta = {
      sourceDir: groupPoi.out(ns.trn.sourceDirectory).term.value,
      targetDir: groupPoi.out(ns.trn.targetDirectory).term.value,
      templateFilename: groupPoi.out(ns.trn.template).term.value
    }
  }

  /**
   * Processes entry content to post page
   * @param {Object} message - The message object
   * @param {Object} contentGroupID - The ID of the content group
   */
  async entryContentToPostPage(message, contentGroupID) {
    const postcraftConfig = message.dataset
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })

    message.entryContentToPage = {
      targetDir: groupPoi.out(ns.trn.targetDirectory).term.value,
      templateFilename: groupPoi.out(ns.trn.template).term.value
    }
  }

  /**
   * Processes index page
   * @param {Object} message - The message object
   * @param {Object} contentGroupID - The ID of the content group
   */
  async indexPage(message, contentGroupID) {
    const postcraftConfig = message.dataset
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })

    message.indexPage = {
      filepath: groupPoi.out(ns.trn.filepath).term.value,
      templateFilename: groupPoi.out(ns.trn.template).term.value
    }
  }

  /**
 * Processes feed page
 * @param {Object} message - The message object
 * @param {Object} contentGroupID - The ID of the content group
 */
  async atomFeed(message, contentGroupID) {
    const postcraftConfig = message.dataset
    const groupPoi = rdf.grapoi({ dataset: postcraftConfig, term: contentGroupID })

    message.atomFeed = {
      filepath: groupPoi.out(ns.trn.filepath).term.value,
      templateFilename: groupPoi.out(ns.trn.template).term.value
    }
  }
}

export default ConfigMap