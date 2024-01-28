import { ServiceContainer } from './ServiceContainer.js';

export class DependencyInjector {
  constructor() {
    this.container = new ServiceContainer()
  }

  // Injects the dependencies into an uninstantiated class
  make(Class) {
    return Class.__inject(this.container)
  }
}


