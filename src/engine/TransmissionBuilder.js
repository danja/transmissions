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
  constructor(app, moduleLoader) {
    this.moduleLoader = moduleLoader
    this.app = app
    this.transmissionCache = new Map()
    this.MAX_NESTING_DEPTH = 10
    this.currentDepth = 0
  }

  async buildTransmissions() {
    logger.debug(`\nTransmissionBuilder.buildTransmissions`)
    const transmissionsDataset = await this.app.datasets.dataset('transmissions')
    const configDataset = await this.app.datasets.dataset('config')

    logger.trace(`transmissionsDataset = \n${transmissionsDataset}`)
    const poi = new grapoi({ dataset: transmissionsDataset })
    const transmissions = []

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.trn.Transmission)) {
        const transmissionID = q.subject
        logger.debug(`\ntransmissionID = ${transmissionID.value}`)

        const transmission = await this.constructTransmission(
          transmissionsDataset,
          transmissionID,
          configDataset
        )
        // Set app reference on transmission
        transmission.app = this.app
        transmissions.push(transmission)
      }
    }
    return transmissions
  }

  async constructTransmission(transmissionsDataset, transmissionID, configDataset) {
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

    const transPoi = grapoi({ dataset: transmissionsDataset, term: transmissionID })
    const pipenodes = GrapoiHelpers.listToArray(transmissionsDataset, transmissionID, ns.trn.pipe)

    for (const quad of transPoi.out(ns.rdfs.label).quads()) {
      transmission.label = quad.object.value
    }
    logger.log('\n+ ***** Construct Transmission : ' + transmission.label + ' <' + transmission.id + '>')

    await this.createNodes(transmission, pipenodes, transmissionsDataset, configDataset)
    this.connectNodes(transmission, pipenodes)

    this.currentDepth--
    return transmission
  }

  async createNodes(transmission, pipenodes, transmissionsDataset, configDataset) {
    for (const node of pipenodes) {
      //  node.value is either the name of a processor or a nested transmission

      if (!transmission.get(node.value)) {
        const np = rdf.grapoi({ dataset: transmissionsDataset, term: node })
        const processorType = np.out(ns.rdf.type).term

        const settingsNode = np.out(ns.trn.settings).term
        //   const settingsNodeName = settingsNode ? settingsNode.value : undefined

        logger.debug(`Creating processor:
          Node: :${ns.shortName(node?.value)}
          Type: :${ns.shortName(processorType?.value)}
          SettingsNode: :${ns.shortName(settingsNode?.value)}
        `)
        //    Config: \n${processorsConfig}
        // Check if node is a nested transmission transmissionsDataset
        // if (processorType && this.isTransmissionReference(processorType)) {
        if (processorType && this.isTransmissionReference(transmissionsDataset, processorType)) {
          const nestedTransmission = await this.constructTransmission(
            transmissionsDataset,
            processorType, // is used?
            configDataset
          )
          transmission.register(node.value, nestedTransmission)
        } else {
          // Regular processor handling
          const processorBase = await this.createProcessor(processorType, configDataset)
          processorBase.id = node.value
          processorBase.type = processorType
          if (settingsNode) {
            processorBase.settingsNode = settingsNode
          }

          // Set the app reference on the processor
          processorBase.app = transmission.app

          // Connect to the transmission's whiteboard
          processorBase.whiteboard = transmission.whiteboard // feels redundant...
          processorBase.x = `X`
          const processorInstance = transmission.register(node.value, processorBase)
        }
      }
    }
  }

  isTransmissionReference(transmissionsDataset, processorType) {
    const processorPoi = grapoi({ dataset: transmissionsDataset, term: processorType })
    return processorPoi.out(ns.rdf.type).terms.some(t => t.equals(ns.trn.Transmission))
  }

  /*
    isTransmissionReference(processorType) {
    const processorPoi = grapoi({ dataset: this.app.dataset, term: processorType })
    return processorPoi.out(ns.rdf.type).terms.some(t => t.equals(ns.trn.Transmission))
  }
    */

  getPipeNodes(transmissionsDataset, transmissionID) {
    const transPoi = grapoi({ dataset: transmissionsDataset, term: transmissionID })
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

  async createProcessor(type, configDataset) {
    logger.debug(`TransmissionBuilder.createProcessor`)
    logger.trace(`config = ${configDataset}`)

    const coreProcessor = AbstractProcessorFactory.createProcessor(type, this.app)
    if (coreProcessor) {
      coreProcessor.configDataset = this.app.datasets.dataset('config') // TODO this looks wrong
      // Make sure the transmissionConfig is set correctly
      coreProcessor.transmissionConfig = this.app.datasets.dataset('transmissions')
      return coreProcessor
    }

    logger.debug(`TransmissionBuilder, core processor not found for ${type?.value}. Trying remote module loader...`)

    try {
      const shortName = type.value.split('/').pop()
      logger.debug(`TransmissionBuilder, loading module: ${shortName}`)
      const ProcessorClass = await this.moduleLoader.loadModule(shortName)

      logger.debug(`Module loaded successfully: ${shortName}`)
      const moduleProcessor = new ProcessorClass.default(configDataset.dataset)
      moduleProcessor.configDataset = configDataset
      moduleProcessor.transmissionConfig = this.app.transmissionsDataset
      return moduleProcessor
    } catch (error) {
      logger.error(`TransmissionBuilder.createProcessor, failed to load ${type?.value} : ${error.message}`)
      throw new Error(`Failed to load processor module: ${error.message}`)
    }
  }


}

export default TransmissionBuilder