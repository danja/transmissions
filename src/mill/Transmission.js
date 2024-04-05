import logger from '../utils/Logger.js'
import Connector from './Connector.js'

class Transmission {
  constructor() {
    this.services = {}
    this.connectors = []
    logger.log("Transmission constructor")
  }

  register(serviceName, instance) {
    this.services[serviceName] = instance
    console.log('Registered service:', serviceName); // Add this line
  }

  get(serviceName) {
    return this.services[serviceName]
  }

  connect(fromServiceName, toServiceName) {
    let connector = new Connector(fromServiceName, toServiceName)
    this.connectors.push(connector)
    connector.connect(this.services)
  }

  async execute(data = false, context = {}) {
    logger.log("\n*** Execution ***")
    const serviceName = this.connectors[0].fromName

    let service = this.get(serviceName)
    logger.log("\nTransmission running service : " + serviceName)

    // Start the first service
    service.execute(data, context)
  }

  /**
 * Describes the structure of the Transmission instance,
 * listing all registered services and connectors.
 */
  describe() {
    let description = 'Transmission Structure:\n';

    // Describe services
    description += 'Services:\n';
    Object.keys(this.services).forEach(serviceName => {
      description += `  - ${serviceName}\n`;
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