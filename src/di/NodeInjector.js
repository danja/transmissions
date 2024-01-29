import logger from '../utils/Logger.js'


import { ServiceContainer } from './ServiceContainer.js';

export class NodeInjector {
  constructor(transmissionConfig) {
    // Pass the transmission configuration to the ServiceContainer
    this.container = new ServiceContainer(transmissionConfig)

  }

  // Injects the dependencies into an uninstantiated class
  make(Class) {
    logger.log("NodeInjector making : " + Class.name)
    return Class.__inject(this.container)
  }
}
