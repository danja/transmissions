
import { ServiceContainer } from './ServiceContainer.js';

export class NodeInjector {
  constructor(transmissionConfig) {
    // Pass the transmission configuration to the ServiceContainer
    this.container = new ServiceContainer(transmissionConfig)
  }

  // Injects the dependencies into an uninstantiated class
  make(Class) {
    return Class.__inject(this.container)
  }
}
