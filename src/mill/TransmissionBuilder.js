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
    logger.info('\n****** TransmissionBuilder ******')
    logger.info('* transmissionConfigFile : ' + transmissionConfigFile)
    const transmissionConfig = await TransmissionBuilder.readDataset(transmissionConfigFile)
    logger.info('* servicesConfigFile : ' + servicesConfigFile)
    const servicesConfig = await TransmissionBuilder.readDataset(servicesConfigFile)
    // relative to run.js
    // TransmissionBuilder.writeDataset(dataset, "./applications/output.ttl")

    const poi = grapoi({ dataset: transmissionConfig })

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.trm.Pipeline)) { // 
        return TransmissionBuilder.buildPipeline(transmissionConfig, q.subject, servicesConfig)
      }
    }
    // throw error
  }


  static buildPipeline(transmissionConfig, pipelineID, servicesConfig) {
    logger.log('\n*** Construction ***')
    const transmission = new Transmission()

    let previousName = "nothing"

    // grapoi probably has a built-in for all this
    const pipenodes = GrapoiHelpers.listToArray(transmissionConfig, pipelineID, ns.trm.pipe)

    for (let i = 0; i < pipenodes.length; i++) {
      let node = pipenodes[i]
      let serviceName = node.value

      let np = rdf.grapoi({ dataset: transmissionConfig, term: node })

      let serviceType = np.out(ns.rdf.type).term

      let serviceConfig = np.out(ns.trm.configKey).term

      logger.log("+ Create/register service <" + serviceName + "> of type <" + serviceType.value + ">")

      let service = AbstractServiceFactory.createService(serviceType, servicesConfig)
      if (serviceConfig) {
        //  logger.debug("\n*****SERVICE***** serviceConfig = " + serviceConfig.value)
        service.configKey = serviceConfig // .value

      }
      transmission.register(serviceName, service)

      if (i != 0) {
        logger.log("  > Connect #" + i + " [" + previousName + "] => [" + serviceName + "]")
        transmission.connect(previousName, serviceName)
      }
      previousName = serviceName
    }
    return transmission
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