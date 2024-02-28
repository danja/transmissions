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
    logger.log("Registering : " + serviceName)
  }

  get(serviceName) {
    return this.services[serviceName]
  }

  connect(fromServiceName, toServiceName) {
    logger.log("Connecting : [" + fromServiceName + "]->[" + toServiceName + "]")
    this.connectors.push(new Connector(fromServiceName, toServiceName))
  }

  execute(config) {
    let previousService = null
    const firstServiceName = this.connectors[0].fromName
    let firstService = this.get(firstServiceName)
    let previousData = firstService.execute(config)
    // this.connectors[0].data = firstService.execute(config)

    for (let i = 0; i < this.connectors.length; i++) {
      logger.log("Current node : " + i)
      let connector = this.connectors[i]
      logger.log(connector.fromName + " => " + connector.toName)
      let currentService = this.get(this.connector.toName)
      previousData = firstService.execute(previousData, config)
    }
  }
}

export default Transmission