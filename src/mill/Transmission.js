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
    console.log('Connecting:', fromServiceName, 'to:', toServiceName); // Add this line

    let connector = new Connector(fromServiceName, toServiceName)
    this.connectors.push(connector)
    connector.connect(this.services)
  }

  async execute(data, context) {
    logger.log("\n*** Execution ***")
    const serviceName = this.connectors[0].fromName

    let service = this.get(serviceName)
    logger.log("\nTransmission running service : " + serviceName)

    // Start the first service
    service.execute(data, context)
  }
}

export default Transmission