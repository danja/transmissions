import logger from '../utils/Logger.js'
import Connector from './Connector.js'
import ns from '../utils/ns.js'

class Transmission {
  constructor() {
    this.processors = {}
    this.connectors = []
    //  logger.log("Transmission constructor")
  }

  register(processorName, instance) {
    this.processors[processorName] = instance
    // console.log('Registered processor:', processorName)
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

  async process(message) {
    logger.log(`\n+ Run Transmission : ${this.label} <${this.id}>`)
    const processorName = this.connectors[0]?.fromName || Object.keys(this.processors)[0]
    let processor = this.get(processorName)
    if (processor) {
      logger.log(`|-> ${ns.shortName(processorName)} a ${processor.constructor.name}`)
      await processor.receive(message)
    } else {
      logger.error("No valid processor found to execute")
    }
  }


  /**
 * Describes the structure of the Transmission instance,
 * listing all registered processors and connectors.
 */
  toString() {
    let description = 'Transmission Structure:\n'

    // Describe processors
    description += 'Processors:\n'
    Object.keys(this.processors).forEach((processorName) => {
      //     description += `${ processor }`

      description += `  - ${ns.shortName(processorName)} a ${this.processors[processorName]} \n`
      //  description += `  - ${ ns.shortName(processorName) }\n`
    })

    /*
      let name = ns.getShortname(processorName)
              let type = ns.getShortname(processorType.value)

              logger.log("| Create processor :" + name + " of type :" + type)
              */

    // Describe connectors
    description += 'Connectors:\n'
    this.connectors.forEach((connector, index) => {
      description += `  - Connector ${index + 1}: ${ns.shortName(connector.fromName)} -> ${ns.shortName(connector.toName)} \n`
    })

    return description
  }
}

export default Transmission