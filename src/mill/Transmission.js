import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'


class Transmission {
  constructor() {
    this.services = {}
    this.connectors = {}
    logger.log("Transmission constructor")
  }

  register(serviceName, instance) {
    this.services[serviceName] = instance
  }

  get(serviceName) {
    return this.services[serviceName]
  }

  connect(fromService, toService) {
    logger.log("****** Connector.connect : \n***" + Reveal.asJSON(fromService) + "\n to \n" + Reveal.asJSON(toService))
    if (!this.connectors[fromService.constructor.name]) {
      this.connectors[fromService.constructor.name] = []
    }
    this.connectors[fromService.constructor.name].push(toService)
  }

  async execute() {
    // Start with the source services
    for (let serviceName in this.services) {
      let service = this.services[serviceName];
      if (service.type === 'source') {
        await service.execute();
      }
    }

    // Then execute the process services
    for (let serviceName in this.services) {
      let service = this.services[serviceName];
      if (service.type === 'process') {
        await service.execute();
      }
    }

    // Finally, execute the sink services
    for (let serviceName in this.services) {
      let service = this.services[serviceName];
      if (service.type === 'sink') {
        await service.execute();
      }
    }
  }
}

export default Transmission