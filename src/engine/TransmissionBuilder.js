// TODO refactor (according to dependencies?)
import rdf from 'rdf-ext'
import grapoi from 'grapoi'
// import { fromFile, toFile } from 'rdf-utils-fs'

import ns from '../utils/ns.js'
import GrapoiHelpers from '../utils/GrapoiHelpers.js'
import logger from '../utils/Logger.js'

import AbstractProcessorFactory from "./AbstractProcessorFactory.js"
import Transmission from '../model/Transmission.js'
import Whiteboard from '../model/Whiteboard.js'

class TransmissionBuilder {
  constructor(moduleLoader, app) {
    this.moduleLoader = moduleLoader
    this.app = app
    this.transmissionCache = new Map()
    this.MAX_NESTING_DEPTH = 10
    this.currentDepth = 0
  }

  async buildTransmissions(app, transmissionConfig, configModel) {
    logger.debug(`\nTransmissionBuilder.buildTransmissions`)
    // logger.debug(`transmissionConfig = \n${transmissionConfig}`)
    const poi = grapoi({ dataset: transmissionConfig })
    const transmissions = []

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.trn.Transmission)) {
        const transmissionID = q.subject
        logger.debug(`\ntransmissionID = ${transmissionID.value}`)

        const transmission = await this.constructTransmission(
          transmissionConfig,
          transmissionID,
          configModel
        )
        // logger.reveal(app)
        transmission.app = app
        transmissions.push(transmission)
      }
    }
    return transmissions
  }

  async constructTransmission(transmissionConfig, transmissionID, configModel) {
    // REFACTORHERE
    const processorsConfig = configModel.dataset
    processorsConfig.kind = 'config'
    processorsConfig.whiteboard = {}
    logger.debug(`\nTransmissionBuilder.constructTransmission`)

    if (++this.currentDepth > this.MAX_NESTING_DEPTH) {
      throw new Error(`Maximum transmission nesting depth of ${this.MAX_NESTING_DEPTH} exceeded`)
    }

    if (this.transmissionCache.has(transmissionID.value)) {
      return this.transmissionCache.get(transmissionID.value)
    }

    const transmission = new Transmission()
    transmission.id = transmissionID.value
    transmission.app = this.app

    transmission.whiteboard = new Whiteboard()

    //  processorsConfig.whiteboard = {}
    transmission.label = ''

    const transPoi = grapoi({ dataset: transmissionConfig, term: transmissionID })
    const pipenodes = GrapoiHelpers.listToArray(transmissionConfig, transmissionID, ns.trn.pipe)

    for (const quad of transPoi.out(ns.rdfs.label).quads()) {
      transmission.label = quad.object.value
    }
    logger.log('\n+ ***** Construct Transmission : ' + transmission.label + ' <' + transmission.id + '>')

    await this.createNodes(transmission, pipenodes, transmissionConfig, configModel)
    this.connectNodes(transmission, pipenodes)

    this.currentDepth--
    return transmission
  }

  async createNodes(transmission, pipenodes, transmissionConfig, configModel) {
    for (const node of pipenodes) {
      //  node.value is either the name of a processor or a nested transmission

      if (!transmission.get(node.value)) {
        const np = rdf.grapoi({ dataset: transmissionConfig, term: node })
        const processorType = np.out(ns.rdf.type).term

        const settingsNode = np.out(ns.trn.settings).term
        //   const settingsNodeName = settingsNode ? settingsNode.value : undefined

        logger.debug(`Creating processor:
          Node: :${ns.shortName(node?.value)}
          Type: :${ns.shortName(processorType?.value)}
          SettingsNode: :${ns.shortName(settingsNode?.value)}
        `)
        //    Config: \n${processorsConfig}
        // Check if node is a nested transmission transmissionConfig
        // if (processorType && this.isTransmissionReference(processorType)) {
        if (processorType && this.isTransmissionReference(transmissionConfig, processorType)) {
          const nestedTransmission = await this.constructTransmission(
            transmissionConfig,
            processorType, // is used?
            configModel
          )
          transmission.register(node.value, nestedTransmission)
        } else {
          // Regular processor handling
          const processorBase = await this.createProcessor(processorType, configModel, transmissionConfig)
          processorBase.id = node.value
          processorBase.type = processorType
          if (settingsNode) {
            processorBase.settingsNode = settingsNode
          }
          // NOPE  transmissionConfig.kind = `transmissionConfig`
          //  processorBase.transmissionConfig = transmissionConfig
          //  logger.reveal(transmission) ///////////////////////////////////7
          processorBase.whiteboard = transmission.whiteboard // feels redundant...
          processorBase.x = `X`
          const processorInstance = transmission.register(node.value, processorBase)

          processorInstance.app = transmission.app
          processorInstance.app.transmissionConfig = transmissionConfig
        }
      }
    }
  }

  isTransmissionReference(transmissionConfig, processorType) {
    const processorPoi = grapoi({ dataset: transmissionConfig, term: processorType })
    return processorPoi.out(ns.rdf.type).terms.some(t => t.equals(ns.trn.Transmission))
  }

  /*
    isTransmissionReference(processorType) {
    const processorPoi = grapoi({ dataset: this.app.dataset, term: processorType })
    return processorPoi.out(ns.rdf.type).terms.some(t => t.equals(ns.trn.Transmission))
  }
    */

  getPipeNodes(transmissionConfig, transmissionID) {
    const transPoi = grapoi({ dataset: transmissionConfig, term: transmissionID })
    return transPoi.out(ns.trn.pipe).terms
  }

  async connectNodes(transmission, pipenodes) {
    for (let i = 0; i < pipenodes.length - 1; i++) {
      let leftNode = pipenodes[i]
      let leftProcessorName = leftNode.value
      let rightNode = pipenodes[i + 1]
      let rightProcessorName = rightNode.value
      logger.log("  > Connect #" + i + " [" + ns.getShortname(leftProcessorName) + "] => [" + ns.getShortname(rightProcessorName) + "]")
      transmission.connect(leftProcessorName, rightProcessorName)
    }
  }

  async createProcessor(type, configModel, transmissionConfig) {
    // REFACTOR HERE
    // const config = configModel.dataset
    logger.debug(`\n\nTransmissionBuilder.createProcessor, config = ${configModel}`)

    const coreProcessor = AbstractProcessorFactory.createProcessor(type, configModel.dataset, transmissionConfig)
    if (coreProcessor) {
      coreProcessor.configModel = configModel
      return coreProcessor
    }

    logger.debug(`TransmissionBuilder, core processor not found for ${type?.value}. Trying remote module loader...`)

    try {
      const shortName = type.value.split('/').pop()
      logger.debug(`TransmissionBuilder, loading module: ${shortName}`)
      const ProcessorClass = await this.moduleLoader.loadModule(shortName)

      logger.debug(`Module loaded successfully: ${shortName}`)
      const moduleProcessor = new ProcessorClass.default(configModel.dataset)
      moduleProcessor.configModel = configModel
    } catch (error) {
      logger.error(`TransmissionBuilder.createProcessor, failed to load ${type?.value} : ${error.message}`)
      process.exit(1)
    }
    return moduleProcessor
  }


}

export default TransmissionBuilder