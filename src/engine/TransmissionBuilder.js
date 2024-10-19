//import path from 'path';
//import { fileURLToPath } from 'url';

import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import { fromFile, toFile } from 'rdf-utils-fs'

import ns from '../utils/ns.js'
import GrapoiHelpers from '../utils/GrapoiHelpers.js'
import logger from '../utils/Logger.js'

import { ModuleLoader } from './ModuleLoader.js';
import AbstractProcessorFactory from "./AbstractProcessorFactory.js";
import Transmission from './Transmission.js'

// TODO it looks like multiple copies of the config are being created - should be a singleton object

class TransmissionBuilder {


  constructor(moduleLoader) {
    this.moduleLoader = moduleLoader;

  }

  static async build(transmissionConfigFile, processorsConfigFile, modulePath) {

    const transmissionConfig = await TransmissionBuilder.readDataset(transmissionConfigFile);
    const processorsConfig = await TransmissionBuilder.readDataset(processorsConfigFile);

    const moduleLoader = new ModuleLoader([modulePath]);
    logger.log("ModuleLoader created with modulePath = " + modulePath);

    logger.log('RRRReveal moduleLoader: ')
    logger.reveal(moduleLoader)
    const builder = new TransmissionBuilder(moduleLoader);
    return builder.buildTransmissions(transmissionConfig, processorsConfig);
  }

  async buildTransmissions(transmissionConfig, processorsConfig) {
    const poi = grapoi({ dataset: transmissionConfig });
    const transmissions = [];

    for (const q of poi.out(ns.rdf.type).quads()) {
      if (q.object.equals(ns.trm.Pipeline)) {
        const pipelineID = q.subject;
        //    transmissions.push(await this.constructTransmission(transmissionConfig, pipelineID, processorsConfig));
        transmissions.push(await this.constructTransmission(transmissionConfig, pipelineID, processorsConfig)); // was await 
      }
    }
    return transmissions;
  }

  async constructTransmission(transmissionConfig, pipelineID, processorsConfig) {
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
    const pipenodes = GrapoiHelpers.listToArray(transmissionConfig, pipelineID, ns.trm.pipe);
    await this.createNodes(transmission, pipenodes, transmissionConfig, processorsConfig); // was await, bad Claude
    //    this.createNodes(transmission, pipenodes, transmissionConfig, processorsConfig); // was await, bad Claude
    this.connectNodes(transmission, pipenodes);
    return transmission;
  }

  async createNodes(transmission, pipenodes, transmissionConfig, processorsConfig) {
    for (let i = 0; i < pipenodes.length; i++) {
      let node = pipenodes[i];
      let processorName = node.value;

      if (!transmission.get(processorName)) {
        let np = rdf.grapoi({ dataset: transmissionConfig, term: node });
        let processorType = np.out(ns.rdf.type).term;
        let processorConfig = np.out(ns.trm.configKey).term;

        try {
          let name = ns.getShortname(processorName);
          let type = ns.getShortname(processorType.value);

          logger.log("| Create processor :" + name + " of type :" + type);
          let processor = await this.createProcessor(processorType, processorsConfig); // was await
          processor.id = processorName;
          processor.type = processorType;
          processor.transmission = transmission;

          if (processorConfig) {
            processor.configKey = processorConfig;
          }
          transmission.register(processorName, processor);
        } catch (err) {
          logger.error('-> Can\'t resolve ' + processorName + ' (check transmission.ttl for typos!)\n');
          logger.error(err);
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
    try {
      const coreProcessor = AbstractProcessorFactory.createProcessor(type, config);
      if (coreProcessor) {
        return coreProcessor;
      }
    } catch (error) {
      logger.debug(`| -> ${type.value} processor not found in core. Trying remote module loader...`);

      try {

        const shortName = type.value.split('/').pop(); // TODO use util function
        logger.debug(`shortName = ${shortName}`);
        const ProcessorClass = await this.moduleLoader.loadModule(shortName);
        logger.debug('reveal---------------------------------vvvv-------')
        logger.reveal(ProcessorClass)
        logger.debug(`ProcessorClass = ${ProcessorClass}`)
        logger.debug('reveal-------------------------^^^^---------------')
        return new ProcessorClass(config);
      } catch (error) {
        logger.debug(`\n!!! Processor not found anywhere : ${type.value}. \n\n*** I quit. ***`);

        //  process.exit(1)
      }
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