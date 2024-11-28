//import path from 'path';
//import { fileURLToPath } from 'url';

import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import { fromFile, toFile } from 'rdf-utils-fs'

import ns from '../utils/ns.js'
import GrapoiHelpers from '../utils/GrapoiHelpers.js'
import logger from '../utils/Logger.js'

// import ModuleLoader from './ModuleLoader.js'
import AbstractProcessorFactory from "../processors/base/AbstractProcessorFactory.js"
import Transmission from '../engine/Transmission.js'
// import ModuleLoaderFactory from './ModuleLoaderFactory.js'

// TODO it looks like multiple copies of the config are being created - should be a singleton object

class TransmissionBuilder {

  constructor(moduleLoader) {
    this.moduleLoader = moduleLoader
  }

  static async build(transmissionConfigFile, processorsConfigFile, moduleLoader) {
    const transmissionConfig = await TransmissionBuilder.readDataset(transmissionConfigFile)
    const processorsConfig = await TransmissionBuilder.readDataset(processorsConfigFile)

    const builder = new TransmissionBuilder(moduleLoader)
    return builder.buildTransmissions(transmissionConfig, processorsConfig)
  }

  async buildTransmissions(transmissionConfig, processorsConfig) {
    const poi = grapoi({ dataset: transmissionConfig })
    const transmissions = []

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.trm.Transmission)) {
        const transmissionID = q.subject
        //    transmissions.push(await this.constructTransmission(transmissionConfig, transmissionID, processorsConfig));
        transmissions.push(await this.constructTransmission(transmissionConfig, transmissionID, processorsConfig)) // was await 
      }
    }
    return transmissions
  }

  async constructTransmission(transmissionConfig, transmissionID, processorsConfig) {
    processorsConfig.whiteboard = {}

    const transmission = new Transmission()
    transmission.id = transmissionID.value
    transmission.label = ''

    const transPoi = grapoi({ dataset: transmissionConfig, term: transmissionID })

    // TODO has grapoi got a first/single property method?
    for (const quad of transPoi.out(ns.rdfs.label).quads()) {
      transmission.label = quad.object.value
    }
    logger.log('\n+ ***** Construct Transmission : ' + transmission.label + ' <' + transmission.id + '>')

    let previousName = "nothing"

    // grapoi probably has a built-in for all this
    const pipenodes = GrapoiHelpers.listToArray(transmissionConfig, transmissionID, ns.trm.pipe)
    await this.createNodes(transmission, pipenodes, transmissionConfig, processorsConfig) // was await, bad Claude
    //    this.createNodes(transmission, pipenodes, transmissionConfig, processorsConfig); // was await, bad Claude
    this.connectNodes(transmission, pipenodes)
    return transmission
  }

  async createNodes(transmission, pipenodes, transmissionConfig, processorsConfig) {
    for (let i = 0; i < pipenodes.length; i++) {
      let node = pipenodes[i]
      let processorName = node.value

      if (!transmission.get(processorName)) {
        let np = rdf.grapoi({ dataset: transmissionConfig, term: node })
        let processorType = np.out(ns.rdf.type).term
        let processorConfig = np.out(ns.trm.configKey).term

        try {
          let name = ns.getShortname(processorName)
          let type = ns.getShortname(processorType.value)

          logger.log("| Create processor :" + name + " of type :" + type)
          let processor = await this.createProcessor(processorType, processorsConfig) // was await
          processor.id = processorName
          processor.type = processorType
          processor.transmission = transmission

          //    logger.log("| processorConfig :" + processorConfig)
          //  logger.reveal(processorConfig)
          if (processorConfig) {
            processor.configKey = processorConfig
          }
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
    //  logger.setLogLevel('debug')
    // try {
    const coreProcessor = AbstractProcessorFactory.createProcessor(type, config)
    if (coreProcessor) {
      return coreProcessor
    }
    //   } catch (error) {
    logger.debug(`TransmissionBuilder, core processor not found for ${type.value}. Trying remote module loader...`)
    //  }

    try {
      const shortName = type.value.split('/').pop()
      logger.debug(`TransmissionBuilder, loading module: ${shortName}`)
      logger.log(this.moduleLoader)
      const ProcessorClass = await this.moduleLoader.loadModule(shortName)

      logger.debug(`Module loaded successfully: ${shortName}`)
      return new ProcessorClass.default(config)
    } catch (error) {
      //   throw new Error(`Failed to load processor ${type.value}: ${error.message}`)
      logger.error(`TransmissionBuilder, failed to load processor ${type.value}`)
      process.exit(1)
    }
  }

  //  logger.error(`Failed to load processor ${type.value}: ${error.message}`)
  //   throw new Error (`Failed to load processor ${type.value}: ${error.mesage}`) 
  //process.exit(1)
  // throw error

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
// export { ModuleLoader, ModuleLoaderFactory, TransmissionBuilder }
export default TransmissionBuilder 