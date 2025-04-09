// ProcessorNodePublisher.js
// Defines node types for transmission processors in node-flow

import { Publisher } from '@elicdavis/node-flow'
import ns from '../../../utils/ns.js'
import logger from '../../../utils/Logger.js'
import rdf from 'rdf-ext'

/**
 * Creates a publisher that defines node types for transmission processors
 * in the node-flow graph.
 */
class ProcessorNodePublisher extends Publisher {
  /**
   * Creates a publisher that defines node types for transmission processors
   */
  constructor() {
    super({
      name: 'Transmissions',
      description: 'Processor nodes for Transmissions',
      version: '1.0.0',
      nodes: {}
    })

    // Register common processor types
    this.registerCommonProcessorTypes()
  }

  /**
   * Registers common processor types found in transmission files
   */
  registerCommonProcessorTypes() {
    // Core processors
    this.registerProcessor('DeadEnd', 'Ends the pipeline without error')
    this.registerProcessor('Halt', 'Stops pipeline execution with error')
    this.registerProcessor('ShowConfig', 'Displays configuration and continues')
    this.registerProcessor('ShowMessage', 'Displays message contents and continues')
    this.registerProcessor('NOP', 'No operation, just passes message through')
    this.registerProcessor('Unfork', 'Collapses all pipes but one')

    // File processors
    this.registerProcessor('FileReader', 'Reads a file into the message')
    this.registerProcessor('FileWriter', 'Writes message content to a file')

    // JSON processors
    this.registerProcessor('JSONWalker', 'Navigates JSON structure')

    // Text processors
    this.registerProcessor('Restructure', 'Restructures message content')
    this.registerProcessor('MarkdownFormatter', 'Formats content as Markdown')
  }

  /**
   * Registers a processor type as a node type
   * @param {string} type - Processor type name
   * @param {string} description - Description of the processor
   */
  registerProcessor(type, description = '') {
    const config = this.createProcessorNodeConfig(type, description)
    this.register(type, config)
    logger.debug(`ProcessorNodePublisher: Registered processor type: ${type}`)
  }

  /**
   * Creates a node configuration for a processor type
   * @param {string} type - Processor type name
   * @param {string} description - Description of the processor
   * @returns {Object} - Node configuration object
   */
  createProcessorNodeConfig(type, description) {
    return {
      title: type,
      subTitle: description,
      info: description,
      canEditInfo: true,
      locked: false,
      style: {
        title: {
          color: '#154050',
          textStyle: {
            color: '#afb9bb'
          }
        }
      },
      inputs: [{
        name: 'in',
        type: 'message'
      }],
      outputs: [{
        name: 'out',
        type: 'message'
      }],
      data: {
        processorType: type
      }
    }
  }

  /**
   * Registers processor types discovered in a transmission
   * @param {Array} transmissions - Array of transmission data objects
   */
  registerProcessorsFromTransmissions(transmissions) {
    const registeredTypes = new Set()

    for (const transmission of transmissions) {
      for (const processor of transmission.processors) {
        const shortType = processor.shortType

        if (shortType && !registeredTypes.has(shortType) && !this.nodes().has(shortType)) {
          this.registerProcessor(shortType)
          registeredTypes.add(shortType)
        }
      }
    }
  }
}

export default ProcessorNodePublisher