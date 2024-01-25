const LogHelper = require('./LogHelper')
const EmailLogHelper = require('./EmailLogHelper')

class ServiceContainer {
  constructor() {
    // We define the service classes here, but we won't
    // instantiate them until they're needed.
    this.definitions = {
      logging: LogHelper,
      emailLogging: EmailLogHelper,
    }

    // This is where the container will store service instances
    // so they can be reused when requested.
    this.instances = {}
  }

  getService(serviceName) {
    // Create a service instance if one doesn't already exist.
    if ( !this.instances[serviceName] ) {
      const ServiceClass = this.definitions[serviceName]
      this.instances[serviceName] = new ServiceClass()
    }
    return this.instances[serviceName]
  }
}

module.exports = exports = ServiceContainer
