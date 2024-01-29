
import { Transmission } from './Transmission.js'
import { ServiceFactory } from './ServiceFactory.js'
import { Connector } from '../services/Connector.js'
import { StringSource } from '../services/StringSource.js'
import { StringSink } from '../services/StringSink.js'
import { AppendProcess } from '../services/AppendProcess.js'

export class ServiceContainer {
  constructor(transmission) {
    // Dynamically create definitions based on the transmission configuration
    this.definitions = {};
    this.definitions['connector'] = Connector;
    transmission.forEach(item => {
      switch (item.node) {
        case 'StringSource':
          this.definitions['source'] = StringSource;
          break;
        //    case 'Connector':
        //    this.definitions['connector'] = Connector;
        //  break;
        case 'StringSink':
          this.definitions['sink'] = StringSink;
          break;
        case 'AppendProcess':
          this.definitions['process'] = AppendProcess;
          break;
      }
    })

    // Store for service instances for reuse
    this.instances = {};

    // Store the transmission configuration
    this.transmissionConfig = transmission.map(item => item.node);
  }

  getService(serviceName) {
    // Create a service instance if one doesn't already exist
    if (!this.instances[serviceName]) {
      const ServiceClass = this.definitions[serviceName];
      if (ServiceClass) {

        this.instances[serviceName] = ServiceFactory.createService(serviceName, this.transmissionConfig);
      } else {
        throw new Error('Service "' + serviceName + '" is not defined.');
      }
    }
    return this.instances[serviceName];
  }

  executeTransmission() {
    if (!Array.isArray(this.transmissionConfig) || this.transmissionConfig.length === 0) {
      throw new Error('Transmission configuration is not valid.');
    }

    let result;
    for (const serviceName of this.transmissionConfig) {
      const service = this.getService(serviceName);
      result = service.process(result);
    }

    return result;
  }
}
