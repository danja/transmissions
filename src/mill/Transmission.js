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

  // 
  //   this.connectors.push(new Connector(fromServiceName, toServiceName))
  connect(fromServiceName, toServiceName) {
    console.log('Connecting:', fromServiceName, 'to:', toServiceName); // Add this line

    let connector = new Connector(fromServiceName, toServiceName)
    this.connectors.push(connector)
    connector.connect(this.services)
  }

  async execute(data) {
    logger.log("\n*** Execution ***")
    const serviceName = this.connectors[0].fromName

    let service = this.get(serviceName)
    logger.log("\nTransmission running service : " + serviceName)

    // Start the first service
    service.execute(data)
  }

  /*
  async execute(data) {
    logger.log("\n*** Execution ***")
    // let previousService = null
    //  logger.debug("E config = " + config)
    const firstServiceName = this.connectors[0].fromName
    let firstService = this.get(firstServiceName)
    logger.log("\nTransmission running service : " + firstServiceName)
    let previousData = await firstService.execute(data)
    logger.debug("Previous data : " + previousData)
    // this.connectors[0].data = firstService.execute(config)

    for (let i = 0; i < this.connectors.length; i++) {
      logger.debug("Current node : " + i)
      logger.debug("Previous data : " + previousData)
      let connector = this.connectors[i]
      logger.debug(connector.fromName + " => " + connector.toName)
      let currentService = this.get(connector.toName)

      logger.log("\nTransmission running service : " + connector.toName)
      previousData = await currentService.execute(previousData)
    }
  */
}




export default Transmission