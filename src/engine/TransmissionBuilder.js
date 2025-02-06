import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import { fromFile, toFile } from 'rdf-utils-fs'

import ns from '../utils/ns.js'
import GrapoiHelpers from '../utils/GrapoiHelpers.js'
import logger from '../utils/Logger.js'

import AbstractProcessorFactory from "../processors/base/AbstractProcessorFactory.js"
import Transmission from '../model/Transmission.js'


class TransmissionBuilder {
  constructor(moduleLoader, app) { // Add app param
    this.moduleLoader = moduleLoader
    this.app = app
  }

  async buildTransmissions(transmissionConfig, processorsConfig) {
    logger.debug(`\nTransmissionBuilder.buildTransmissions`)
    logger.debug(`**************************transmissionConfig = ${transmissionConfig}`)
    const poi = grapoi({ dataset: transmissionConfig })
    const transmissions = []

    for (const q of poi.out(ns.rdf.type).quads()) {
      logger.debug(`\nQ = ${q}`)
      // logger.reveal(q)
      if (q.object.equals(ns.trn.Transmission)) {
        const transmissionID = q.subject
        logger.debug(`\ntransmissionID = ${transmissionID}`)
        //    transmissions.push(await this.constructTransmission(transmissionConfig, transmissionID, processorsConfig));
        transmissions.push(await this.constructTransmission(transmissionConfig, transmissionID, processorsConfig)) // was await
      }
    }
    return transmissions
  }

  async constructTransmission(transmissionConfig, transmissionID, processorsConfig) {
    logger.debug(`\nTransmissionBuilder.constructTransmission`)
    const transmission = new Transmission()
    transmission.id = transmissionID.value
    transmission.app = this.app

    processorsConfig.whiteboard = {}

    transmission.label = ''

    const transPoi = grapoi({ dataset: transmissionConfig, term: transmissionID })

    // TODO has grapoi got a first/single property method?
    for (const quad of transPoi.out(ns.rdfs.label).quads()) {
      transmission.label = quad.object.value
    }
    logger.log('\n+ ***** Construct Transmission : ' + transmission.label + ' <' + transmission.id + '>')

    let previousName = "nothing"

    // grapoi probably has a built-in for all this
    const pipenodes = GrapoiHelpers.listToArray(transmissionConfig, transmissionID, ns.trn.pipe)
    await this.createNodes(transmission, pipenodes, transmissionConfig, processorsConfig) // was await, bad Claude
    //    this.createNodes(transmission, pipenodes, transmissionConfig, processorsConfig); // was await, bad Claude
    this.connectNodes(transmission, pipenodes)
    return transmission
  }

  async createNodes(transmission, pipenodes, transmissionConfig, processorsConfig) {
    for (let i = 0; i < pipenodes.length; i++) {
      let node = pipenodes[i]
      let processorName = node.value
      // if (transmissionConfig) {
      // logger.log(`TransmisionBuilder.createNodes, transmissionConfig = ${transmissionConfig}`)
      // }
      if (!transmission.get(processorName)) {
        let np = rdf.grapoi({ dataset: transmissionConfig, term: node })

        let processorType = np.out(ns.rdf.type).term
        let processorConfig = np.out(ns.trn.settings).term

        try {
          let name = ns.getShortname(processorName)
          let type = ns.getShortname(processorType.value)

          logger.log("| Create processor :" + name + " of type :" + type)
          let processor = await this.createProcessor(processorType, processorsConfig)

          processor.id = processorName
          processor.type = processorType
          processor.transmissionNode = node
          processor.transmission = transmission
          processor.settingsNode = processorConfig

          transmission.register(processorName, processor)

        } catch (err) {
          logger.error('-> Can\'t resolve ' + processorName + ' (check transmission.ttl for typos!)\n')
          logger.error(err)
        }
      }
    }
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

  async createProcessor(type, config) {
    logger.trace(`\n\nTransmissionBuilder.createProcessor, config = ${config}`)

    const coreProcessor = AbstractProcessorFactory.createProcessor(type, config)
    if (coreProcessor) {
      return coreProcessor
    }

    logger.debug(`TransmissionBuilder, core processor not found for ${type.value}. Trying remote module loader...`)

    try {
      const shortName = type.value.split('/').pop()
      logger.debug(`TransmissionBuilder, loading module: ${shortName}`)
      logger.log(this.moduleLoader)
      const ProcessorClass = await this.moduleLoader.loadModule(shortName)

      logger.debug(`Module loaded successfully: ${shortName}`)
      return new ProcessorClass.default(config)
    } catch (error) {
      logger.error(`TransmissionBuilder.createProcessor, failed to load ${type.value} : ${error.message}`)
      // logger.debug(`TransmissionBuilder.createProcessor, failed to load ${type.value} : ${error.message}`)
      process.exit(1)
    }
  }

  // file utils
  static async readDataset(filename) {
    const stream = fromFile(filename)
    const dataset = await rdf.dataset().import(stream)
    return dataset
  }

  static async writeDataset(dataset, filename) {
    await toFile(dataset.toStream(), filename)
  }


}
export default TransmissionBuilder