import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'
import Connector from './Connector.js'

class Transmission {
  constructor() {
    this.services = {}
    this.connectors = []
    logger.log("Transmission constructor")
  }

  register(serviceName, instance) {
    this.services[serviceName] = instance
    logger.debug("Registering : " + serviceName)
  }

  get(serviceName) {
    return this.services[serviceName]
  }

  connect(fromServiceName, toServiceName) {
    this.connectors.push(new Connector(fromServiceName, toServiceName))
  }

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
  }


}

export default Transmission