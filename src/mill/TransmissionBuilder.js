import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'
import grapoi from 'grapoi'

import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'

import { ServiceFactory } from "./ServiceFactory.js";
import { Transmission } from './Transmission.js'
import ns from '../utils/ns.js'



class TransmissionBuilder {

  // static knownTransmissions = [ns.trm.Pipeline.value, ns.trm.Other.value]

  static async build(transmissionConfig) {
    logger.debug("TransmissionBuilder reading RDF")
    const dataset = await TransmissionBuilder.readDataset(transmissionConfig)

    // relative to run.js
    // TransmissionBuilder.writeDataset(dataset, "./transmissions/output.ttl")

    // const pipe = grapoi({ dataset, term: ns.trm('pipe/') })
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

    // logger.log(`Building pipeline: ${transmissionID.value}`)
    logger.log('Building pipeline ******')
    const transmission = new Transmission()
    // const nodes = poi.out(ns.trm.pipe).quads
    const first = poi.out(ns.trm.pipe).term

    const pipenodes = TransmissionBuilder.listToArray(dataset, first)

    for (const node of pipenodes) {
      logger.log("node = " + node.value)
    }

    const poi2 = rdf.grapoi({ dataset, term: pipelineID })

    const serviceNames = poi.out(ns.rdf.type, pipenodes).terms

    for (const serviceName of serviceNames) {
      logger.log("serviceName = " + serviceName.value)
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

  // follows chain in rdf:List


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