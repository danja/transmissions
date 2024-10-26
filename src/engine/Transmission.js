import logger from '../utils/Logger.js'
import Connector from './Connector.js'

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
    logger.log(`Transmission.connect from ${fromProcessorName} to ${fromProcessorName}`)
    let connector = new Connector(fromProcessorName, toProcessorName)
    this.connectors.push(connector)
    connector.connect(this.processors)
  }


  // In src/engine/Transmission.js

  async process(message) {
    logger.log('\n+ ***** Execute Transmission : ' + this.label + ' <' + this.id + '>')
    const processorName = this.connectors[0]?.fromName || Object.keys(this.processors)[0]
    let processor = this.get(processorName)
    if (processor) {
      logger.log("| Running : " + processorName + " a " + processor.constructor.name)
      await processor.receive(message)
    } else {
      logger.error("No valid processor found to execute")
    }
  }
  /*
  async process(message) {
    logger.log("\n+ ***** Execute *****")
    // logger.log("\nDATA = " + data)
    const processorName = this.connectors[0].fromName

    let processor = this.get(processorName)
    logger.log("| Running : " + processorName + " a " + processor.constructor.name) // first processor
    // logger.log("\nTransmission running first processor : " + processorName)
    // logger.log("\nTransmission running processor : " + processor)
    // Start the first processor
    // QQQ
    //  processor.process(message)
    processor.receive(message)

  }
*/

  /**
 * Describes the structure of the Transmission instance,
 * listing all registered processors and connectors.
 */
  toString() {
    let description = 'Transmission Structure:\n';

    // Describe processors
    description += 'Processors:\n';
    Object.keys(this.processors).forEach(processorName => {
      description += `  - ${processorName}\n`;
    });

    // Describe connectors
    description += 'Connectors:\n';
    this.connectors.forEach((connector, index) => {
      description += `  - Connector ${index + 1}: ${connector.fromName} -> ${connector.toName}\n`;
    })

    return description
  }
}

export default Transmission