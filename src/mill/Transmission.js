import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'


class Transmission {
  constructor() {
    this.services = []
    this.connectors = []
    logger.log("Transmission constructor")
  }

  addService(service) {
    this.services.push(service)
  }

  addConnector(connector) {
    this.connectors.push(connector)
  }
}

export default Transmission