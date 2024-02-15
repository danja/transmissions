import rdf from 'rdf-ext'
import { fromFile, toFile } from 'rdf-utils-fs'

import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'
import { ServiceFactory } from "./ServiceFactory.js";
import { Transmission } from './Transmission.js'

export class TransmissionBuilder {

  static async build(transmissionConfig) {
    const transmission = new Transmission()
    logger.log("TransmissionBuilder reading RDF")
    const dataset = await TransmissionBuilder.readDataset(transmissionConfig)
    logger.log("TransmissionBuilder building transmission")
    logger.log("TransmissionBuilder dataset = " + Reveal.asMarkdown(dataset))

    // relative to run.js
    TransmissionBuilder.writeDataset(dataset, "./transmissions/output.ttl")
  }

  static async readDataset(filename) {
    const stream = fromFile(filename)
    //    const stream = fromFile(new URL('support/example.ttl', import.meta.url).pathname, { baseIRI: 'http://example.org/' })
    const dataset = await rdf.dataset().import(stream)
    return dataset
  }

  static async writeDataset(dataset, filename) {
    await toFile(dataset.toStream(), filename)
  }


}
