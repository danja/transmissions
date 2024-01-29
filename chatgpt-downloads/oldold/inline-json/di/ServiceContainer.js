import { StringSource } from '../services/StringSource.js'
import { Connector } from '../services/Connector.js'
import { StringSink } from '../services/StringSink.js'
import { AppendProcess } from '../services/AppendProcess.js'

export class ServiceContainer {
  constructor(pipeline) {
    // We define the service classes here, but we won't
    // instantiate them until they're needed.
    this.definitions = {
      source: StringSource,
      connector: Connector,
      sink: StringSink,
      process: AppendProcess,
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

