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

    // for (const quad of pipe.out(ns.schema.hasPart).quads()) {
    //  console.log()
    //  logger.log(`\t${quad.object.value}`)
    // }

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.trm.Pipeline)) { // 
        const poi = rdf.grapoi({ dataset, term: q.subject })
        return TransmissionBuilder.buildPipeline(poi)
      }
    }
    // throw error
  }

  static buildPipeline(poi) {
    // logger.log(`Building pipeline: ${transmissionID.value}`)
    logger.log('Building pipeline ******')
    const transmission = new Transmission()
    // const nodes = poi.out(ns.trm.pipe).quads
    const node1 = poi.out(ns.trm.pipe).term
    logger.log("NODES = " + nodes.value)


    //  const nodes = poi.out(ns.trm.pipe).terms
    //  logger.log("NODES = " + nodes[0].value)



    for (const term in nodes) {
      logger.log(term)
    }



    return transmission
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