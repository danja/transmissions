import logger from '../utils/Logger.js'
import Connector from './Connector.js'
import ns from '../utils/ns.js'

class Transmission {
  constructor(app) {
    this.app = app // is needed?
    this.processors = {}
    this.connectors = []
    this.parent = null
    this.children = new Set()
    this.path = []
    // this.previousMessage = null
  }

  async process(message) {
    logger.debug(`\nTransmission.process`)
    logger.log(`\n+ Run Transmission : ${this.label} <${this.id}>`)

    try {
      const processorName = this.connectors[0]?.fromName || Object.keys(this.processors)[0]
      let processor = this.get(processorName)
      if (processor) {
        logger.log(`|-> ${ns.shortName(processorName)} a ${processor.constructor.name}`)
        
        // If there are no connectors, just process with the single processor
        if (this.connectors.length === 0) {
          const result = await processor.receive(message)
          return result || message
        }
        
        // For connected processors, we need to wait for the final result
        return new Promise((resolve, reject) => {
          // Find the last processor in the chain
          let lastProcessor = processor
          let currentProcessor = processor
          
          // Follow the connector chain to find the last processor
          while (true) {
            const connector = this.connectors.find(c => c.fromName === currentProcessor.id)
            if (!connector) break
            currentProcessor = this.get(connector.toName)
            if (currentProcessor) {
              lastProcessor = currentProcessor
            }
          }
          
          // Listen for the final result from the last processor
          const handleFinalMessage = (finalMessage) => {
            lastProcessor.off('message', handleFinalMessage)
            resolve(finalMessage)
          }
          
          lastProcessor.on('message', handleFinalMessage)
          
          // Start the chain by sending message to first processor
          processor.receive(message).catch(reject)
        })
      } else {
        throw new Error(`No valid processor found to execute, looked for ${processorName}`)
      }
    } catch (error) {
      error.transmissionStack = error.transmissionStack || []
      error.transmissionStack.push(this.id)
      throw error
    }
  }

  register(processorName, instance) {
    let processor = this.get(processorName)
    if (processor instanceof Transmission) {
      processor.parent = this
      processor.path = [...this.path, processorName]
      this.children.add(processor)
    }
    this.processors[processorName] = instance
    return instance
  }

  get(processorName) {
    return this.processors[processorName]
  }

  connect(fromProcessorName, toProcessorName) {
    logger.trace(`Transmission.connect from ${fromProcessorName} to ${fromProcessorName}`)
    let connector = new Connector(fromProcessorName, toProcessorName)
    this.connectors.push(connector)
    connector.connect(this.processors)
  }

  getFirstNode() { // used for nested transmissions
    // logger.log(this)
    //logger.log(this.processors[0])
    return this.processors[0]
  }

  // is used?
  handleError(error) {
    logger.error(`Error in transmission ${this.id}:`, error)
    logger.error('Transmission stack:', error.transmissionStack)
    // Optionally attempt recovery
    if (this.parent) {
      this.parent.handleError(error)
    }
  }

  getTransmissionInfo() {
    return {
      id: this.id,
      path: this.path,
      depth: this.path.length,
      children: Array.from(this.children).map(c => c.id)
    }
  }

  toString() {
    const info = this.getTransmissionInfo()
    let description = `Transmission : ${info.id}
      path: ${info.path},
      depth: ${info.path.length},
      children: ${info.children}`
    // Describe processors
    description += 'Processors:\n'
    Object.keys(this.processors).forEach((processorName) => {
      description += `  - ${ns.shortName(processorName)} a ${this.processors[processorName]} \n`
    })

    // Describe connectors
    description += 'Connectors:\n'
    this.connectors.forEach((connector, index) => {
      description += `  - Connector ${index + 1}: ${ns.shortName(connector.fromName)} -> ${ns.shortName(connector.toName)} \n`
    })

    return description
  }
}

export default Transmission