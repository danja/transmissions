import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import { fromFile, toFile } from 'rdf-utils-fs'

import ns from '../utils/ns.js'
import GrapoiHelpers from '../utils/GrapoiHelpers.js'
import logger from '../utils/Logger.js'

import AbstractServiceFactory from "./AbstractServiceFactory.js";
import Transmission from './Transmission.js'


class TransmissionBuilder {

  static async build(transmissionConfigFile, servicesConfigFile) {
    logger.info('\n+ ***** Load Config ******')
    logger.info('[Transmission : ' + transmissionConfigFile + ']')
    const transmissionConfig = await TransmissionBuilder.readDataset(transmissionConfigFile)
    logger.info('[Config : ' + servicesConfigFile + ']')
    const servicesConfig = await TransmissionBuilder.readDataset(servicesConfigFile)
    // relative to run.js
    // TransmissionBuilder.writeDataset(dataset, "./applications/output.ttl")

    const poi = grapoi({ dataset: transmissionConfig })

    const transmission = new Transmission()

    for (const q of poi.out(ns.rdf.type).quads()) { /// NEEDS MULTIPLE TODO
      if (q.object.equals(ns.trm.Pipeline)) { // 
        TransmissionBuilder.addPipeline(transmission, transmissionConfig, q.subject, servicesConfig)
      }
    }
    // throw error
    return transmission
  }

  // TODO refactor
  static addPipeline(transmission, transmissionConfig, pipelineID, servicesConfig) {
    logger.log('\n+ ***** Construct *****')

    let previousName = "nothing"

    // grapoi probably has a built-in for all this
    const pipenodes = GrapoiHelpers.listToArray(transmissionConfig, pipelineID, ns.trm.pipe)


    this.createNodes(transmission, pipenodes, transmissionConfig, servicesConfig)
    this.connectNodes(transmission, pipenodes)
    return transmission
  }

  static createNodes(transmission, pipenodes, transmissionConfig, servicesConfig) {
    for (let i = 0; i < pipenodes.length; i++) {
      let node = pipenodes[i]
      let serviceName = node.value

      if (!transmission.get(serviceName)) { // may have been created in earlier pipeline
        let np = rdf.grapoi({ dataset: transmissionConfig, term: node })
        let serviceType = np.out(ns.rdf.type).term
        let serviceConfig = np.out(ns.trm.configKey).term
        try {
          logger.log("| Create service <" + serviceName + "> of type <" + serviceType.value + ">")
        } catch (err) {
          logger.error('-> Can\'t resolve ' + serviceName + ' check transmission.ttl\n')
        }
        let service = AbstractServiceFactory.createService(serviceType, servicesConfig)
        service.id = serviceName
        service.type = serviceType
        service.transmission = transmission

        if (serviceConfig) {
          //  logger.debug("\n*****SERVICE***** serviceConfig = " + serviceConfig.value)
          service.configKey = serviceConfig // .value
        }
        transmission.register(serviceName, service)
      }
    }
    //  return transmission
  }

  static connectNodes(transmission, pipenodes) {
    for (let i = 0; i < pipenodes.length - 1; i++) {
      let leftNode = pipenodes[i]
      let leftServiceName = leftNode.value
      let rightNode = pipenodes[i + 1]
      let rightServiceName = rightNode.value
      logger.log("  > Connect #" + i + " [" + leftServiceName + "] => [" + rightServiceName + "]")
      transmission.connect(leftServiceName, rightServiceName)
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