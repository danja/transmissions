import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'
import grapoi from 'grapoi'

import logger from '../utils/Logger.js'

import AbstractServiceFactory from "./AbstractServiceFactory.js";
import Transmission from './Transmission.js'
import ns from '../utils/ns.js'

class TransmissionBuilder {

  static async build(transmissionConfigFile, servicesConfigFile) {
    logger.debug("TransmissionBuilder reading RDF")
    const transmissionConfig = await TransmissionBuilder.readDataset(transmissionConfigFile)
    const servicesConfig = await TransmissionBuilder.readDataset(servicesConfigFile)
    // relative to run.js
    // TransmissionBuilder.writeDataset(dataset, "./transmissions/output.ttl")

    const poi = grapoi({ dataset: transmissionConfig })

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.trm.Pipeline)) { // 
        logger.debug("about to build pipeline")
        return TransmissionBuilder.buildPipeline(transmissionConfig, q.subject, servicesConfig)
      }
    }
    // throw error
  }

  static buildPipeline(transmissionConfig, pipelineID, servicesConfig) {

    const poi = rdf.grapoi({ dataset: transmissionConfig, term: pipelineID })

    logger.log('\n*** Building ***')

    const first = poi.out(ns.trm.pipe).term

    // grapoi probably has a built-in for this
    const pipenodes = TransmissionBuilder.listToArray(transmissionConfig, first)

    const transmission = new Transmission()

    let previousName = "nothing"

    // grapoi probably has a built-in for this
    for (let i = 0; i < pipenodes.length; i++) {
      let node = pipenodes[i]
      let serviceName = node.value
      logger.debug("\nserviceName = " + serviceName)

      let np = rdf.grapoi({ dataset: transmissionConfig, term: node })
      //   logger.poi(np)
      // process.exit()
      let serviceType = np.out(ns.rdf.type).term
      logger.debug("\nserviceType = " + serviceType.value)

      let serviceConfig = np.out(ns.trm.configKey).term

      logger.log("Create/register service <" + serviceName + "> of type <" + serviceType.value + ">")

      let service = AbstractServiceFactory.createService(serviceType, servicesConfig)
      if (serviceConfig) {
        logger.debug("\n************* serviceConfig = " + serviceConfig.value)
        service.configKey = serviceConfig // .value
      }
      transmission.register(serviceName, service)

      if (i != 0) {
        logger.log("Connecting #" + i + " [" + previousName + "] => [" + serviceName + "]")
        transmission.connect(previousName, serviceName)
      }
      previousName = serviceName
    }
    return transmission
  }

  // follows chain in rdf:List
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


  // file utils
  static async readDataset(filename) {
    const stream = fromFile(filename)
    const dataset = await rdf.dataset().import(stream)
    return dataset
  }

  static async writeDataset(dataset, filename) {
    await toFile(dataset.toStream(), filename)
  }

  // unused
  // [subjects] predicate ->  [objects]
  static listObjects(dataset, subjectList, predicate) {
    const objects = []
    for (const subject of subjectList) {
      logger.log("subject = " + subject.value)
      let p = rdf.grapoi({ dataset, term: subject })
      let object = p.out(predicate).term
      logger.log("object = " + object.value)
      objects.push(object)
    }
    return objects
  }
}

export default TransmissionBuilder 