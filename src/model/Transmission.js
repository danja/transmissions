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
  }

  async process(message) {
    logger.debug(`\nTransmission.process`)
    logger.log(`\n+ Run Transmission : ${this.label} <${this.id}>`)

    try {
      const processorName = this.connectors[0]?.fromName || Object.keys(this.processors)[0]
      let processor = this.get(processorName)
      if (processor) {
        logger.log(`|-> ${ns.shortName(processorName)} a ${processor.constructor.name}`)
        await processor.receive(message)
      } else {
        throw new Error("No valid processor found to execute")
      }
    } catch (error) {
      error.transmissionStack = error.transmissionStack || []
      error.transmissionStack.push(this.id)
      throw error
    }
    return message
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