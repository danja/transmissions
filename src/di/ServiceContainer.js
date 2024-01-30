import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'
import { Transmission } from './Transmission.js'
import { ServiceFactory } from './ServiceFactory.js'

export class ServiceContainer {
  constructor(transmission) {
    // Store the entire transmission configuration
    this.transmission = transmission;

    // Store for service instances for reuse
    this.instances = {};
  }

  getService(serviceName) {
    logger.log("ServiceContainer.getService : " + serviceName)
    logger.log("\n : this.instances : " + JSON.stringify(this.instances))
    //     logger.log("\n : this.instances : " + JSON.stringify(this.instances))
    // Create a service instance if one doesn't already exist
    if (!this.instances[serviceName]) {
      // Find the specific configuration for this service
      const serviceConfig = this.transmission.find(item => item.node.toLowerCase() === serviceName.toLowerCase());
      logger.log("ServiceContainer.getService serviceConfig : " + JSON.stringify(serviceConfig))
      if (serviceConfig) {
        // Pass the configuration to the ServiceFactory
        this.instances[serviceName] = ServiceFactory.createService(serviceName, serviceConfig.config);
      } else {
        throw new Error('Service "' + serviceName + '" is not defined.');
      }
    }
    return this.instances[serviceName];
  }
}
