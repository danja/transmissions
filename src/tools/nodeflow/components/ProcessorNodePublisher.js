import { Publisher } from '@elicdavis/node-flow'
import ns from '../../../utils/ns.js'
import logger from '../../../utils/Logger.js'
import rdf from 'rdf-ext'

class ProcessorNodePublisher extends Publisher {
  constructor() {
    super({
      name: 'Transmissions',
      description: 'Processor nodes for Transmissions',
      version: '1.0.0',
      nodes: {}
    })

    // Register the common processor types
    this.registerCommonProcessorTypes()
  }

  registerCommonProcessorTypes() {
    // Register utility processors
    this.registerProcessor('DeadEnd', 'Ends the pipeline without error')
    this.registerProcessor('Halt', 'Stops pipeline execution with error')
    this.registerProcessor('ShowConfig', 'Displays configuration and continues')
    this.registerProcessor('ShowMessage', 'Displays message contents and continues')
    this.registerProcessor('NOP', 'No operation, just passes message through')
    this.registerProcessor('Unfork', 'Collapses all pipes but one')

    // Register file system processors
    this.registerProcessor('FileReader', 'Reads a file into the message')
    this.registerProcessor('FileWriter', 'Writes message content to a file')

    // Register JSON processors
    this.registerProcessor('JSONWalker', 'Navigates JSON structure')

    // Register other common processors
    this.registerProcessor('Restructure', 'Restructures message content')
    this.registerProcessor('MarkdownFormatter', 'Formats content as Markdown')
  }

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
        },
        subTitle: {
          color: 'rgba(7, 33, 42, 0.6)',
          textStyle: {
            color: '#afb9bb',
            fontSize: '10px'
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