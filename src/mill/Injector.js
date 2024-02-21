import logger from '../utils/Logger.js'


import Transmission from './Transmission.js';

export class Injector {
  constructor(transmissionConfig) {
    // Pass the transmission configuration to the ServiceContainer
    this.container = new Transmission(transmissionConfig)

  }

  // Injects the dependencies into an uninstantiated class
  inject(Class) {
    logger.log("Injector making : " + Class.name)
    return Class.__inject(this.container)
  }
}
