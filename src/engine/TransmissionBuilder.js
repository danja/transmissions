import path from 'path';
import { fileURLToPath } from 'url';

import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import { fromFile, toFile } from 'rdf-utils-fs'

import ns from '../utils/ns.js'
import GrapoiHelpers from '../utils/GrapoiHelpers.js'
import logger from '../utils/Logger.js'

import AbstractProcessorFactory from "./AbstractProcessorFactory.js";
import Transmission from './Transmission.js'

// TODO it looks like multiple copies of the config are being created - should be a singleton object

class TransmissionBuilder {

  static async build(transmissionConfigFile, processorsConfigFile) {

    logger.info('\n+ ***** Load Config ******')
    logger.info('[Transmission : ' + transmissionConfigFile + ']')
    const transmissionConfig = await TransmissionBuilder.readDataset(transmissionConfigFile)
    logger.info('[Processors Config : ' + processorsConfigFile + ']')
    // process.exit()
    const processorsConfig = await TransmissionBuilder.readDataset(processorsConfigFile)

    const poi = grapoi({ dataset: transmissionConfig })

    const transmissions = []

    // TODO filter out others when subtask transmission is specified
    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.trm.Pipeline)) {
        const pipelineID = q.subject
        logger.debug('\n+ ' + pipelineID.value)
        transmissions.push(TransmissionBuilder.constructTransmission(transmissionConfig, pipelineID, processorsConfig))
      }
    }
    return transmissions
  }

  // TODO refactor
  static constructTransmission(transmissionConfig, pipelineID, processorsConfig) {
    processorsConfig.whiteboard = {}

    const transmission = new Transmission()
    transmission.id = pipelineID.value
    transmission.label = ''

    const transPoi = grapoi({ dataset: transmissionConfig, term: pipelineID })

    // TODO has grapoi got a first/single property method?
    for (const quad of transPoi.out(ns.rdfs.label).quads()) {
      transmission.label = quad.object.value
    }
    logger.log('\n+ ***** Construct Transmission : ' + transmission.label + ' <' + transmission.id + '>')

    let previousName = "nothing"

    // grapoi probably has a built-in for all this
    const pipenodes = GrapoiHelpers.listToArray(transmissionConfig, pipelineID, ns.trm.pipe)

    this.createNodes(transmission, pipenodes, transmissionConfig, processorsConfig)
    this.connectNodes(transmission, pipenodes)
    return transmission
  }

  static createNodes(transmission, pipenodes, transmissionConfig, processorsConfig) {
    for (let i = 0; i < pipenodes.length; i++) {
      let node = pipenodes[i]
      let processorName = node.value


      if (!transmission.get(processorName)) { // may have been created in earlier pipeline
        let np = rdf.grapoi({ dataset: transmissionConfig, term: node })
        let processorType = np.out(ns.rdf.type).term
        let processorConfig = np.out(ns.trm.configKey).term

        try {

          let name = ns.getShortname(processorName)
          let type = ns.getShortname(processorType.value)

          logger.log("| Create processor :" + name + " of type :" + type)
          //  logger.log("| Create processor <" + processorName + "> of type <" + processorType.value + ">")
        } catch (err) {
          logger.error('-> Can\'t resolve ' + processorName + ' (check transmission.ttl for typos!)\n')
        }
        let processor = AbstractProcessorFactory.createProcessor(processorType, processorsConfig)
        processor.id = processorName
        processor.type = processorType
        processor.transmission = transmission

        if (processorConfig) {
          //  logger.debug("\n*****SERVICE***** processorConfig = " + processorConfig.value)
          processor.configKey = processorConfig // .value
        }
        transmission.register(processorName, processor)
      }
    }
    //  return transmission
  }

  static connectNodes(transmission, pipenodes) {
    for (let i = 0; i < pipenodes.length - 1; i++) {
      let leftNode = pipenodes[i]
      let leftProcessorName = leftNode.value
      let rightNode = pipenodes[i + 1]
      let rightProcessorName = rightNode.value
      logger.log("  > Connect #" + i + " [" + ns.getShortname(leftProcessorName) + "] => [" + ns.getShortname(rightProcessorName) + "]")
      transmission.connect(leftProcessorName, rightProcessorName)
    }
  }
  // follows chain in rdf:List
  /*
  static listToArray(dataset, first) {
    let p = rdf.grapoi({ dataset, term: first })
    let object = p.out(ns.rdf.first).term
    const result = [object]

    while (true) {
      let restHead = p.out(ns.rdf.rest).term
      let p2 = rdf.grapoi({ dataset, term: restHead })
      let object = p2.out(ns.rdf.first).term

      if (restHead.equals(ns.rdf.nil)) break
      result.push(object)
      p = rdf.grapoi({ dataset, term: restHead })
    }
    return result
  }
  */


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