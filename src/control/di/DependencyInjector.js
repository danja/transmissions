const ServiceContainer = require('./ServiceContainer.js')

class DependencyInjector {
  constructor() {
    this.container = new ServiceContainer()
  }

  // Injects the dependencies into an uninstantiated class
  make(Class) {
    return Class.__inject(this.container)
  }
}

module.exports = exports = DependencyInjector
