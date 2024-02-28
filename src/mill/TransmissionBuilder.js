import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'
import grapoi from 'grapoi'

import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'

import ServiceFactory from "./ServiceFactory.js";
import Transmission from './Transmission.js'
import ns from '../utils/ns.js'

class TransmissionBuilder {

  static async build(transmissionConfig) {
    logger.debug("TransmissionBuilder reading RDF")
    const dataset = await TransmissionBuilder.readDataset(transmissionConfig)

    // relative to run.js
    // TransmissionBuilder.writeDataset(dataset, "./transmissions/output.ttl")

    const poi = grapoi({ dataset })

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.trm.Pipeline)) { // 
        return TransmissionBuilder.buildPipeline(dataset, q.subject)
      }
    }
    // throw error
  }

  static buildPipeline(dataset, pipelineID) {

    const poi = rdf.grapoi({ dataset, term: pipelineID })

    logger.log('\n*** Building ***')

    const first = poi.out(ns.trm.pipe).term

    // grapoi probably has a built-in for this
    const pipenodes = TransmissionBuilder.listToArray(dataset, first)

    // for (const node of pipenodes) {
    //  logger.log("node = " + node.value)
    // }

    const transmission = new Transmission()

    let previousName = "nothing"
    // grapoi probably has a built-in for this
    for (let i = 0; i < pipenodes.length; i++) {
      let node = pipenodes[i]
      let serviceName = node.value
      logger.log("\nserviceName = " + serviceName)

      let np = rdf.grapoi({ dataset, term: node })
      let serviceType = np.out(ns.rdf.type).term

      logger.debug("\nserviceType = " + serviceType.value)
      let config = {}

      logger.log("Create/register service <" + serviceName + "> of type <" + serviceType.value + ">")
      let service = ServiceFactory.createService(serviceType, config)
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