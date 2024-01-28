import { Source } from '../services/Source.js'
import { Connector } from '../services/Connector.js'
import { Sink } from '../services/Sink.js'
import { Process } from '../services/Process.js'

export class ServiceContainer {
  constructor() {
    // We define the service classes here, but we won't
    // instantiate them until they're needed.
    this.definitions = {
      source: Source,
      connector: Connector,
      sink: Sink,
      process: Process,
    }

    // This is where the container will store service instances
    // so they can be reused when requested.
    this.instances = {}
  }

  getService(serviceName) {
    // Create a service instance if one doesn't already exist.
    if (!this.instances[serviceName]) {
      const ServiceClass = this.definitions[serviceName]
      if (ServiceClass) {
        this.instances[serviceName] = new ServiceClass()
      } else {
        throw new Error(`Service '${serviceName}' is not defined.`)
      }
    }
    return this.instances[serviceName]
  }
}

