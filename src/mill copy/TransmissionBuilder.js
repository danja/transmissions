import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'
import { ServiceFactory } from "./ServiceFactory.js";


/*
export class SimplePipe extends Injectable {
  static __inject(container) {
    logger.log("SimplePipe.__inject")
    //     container.getService('Connector'),
    return new this(
      container.getService('StringSource'),
      container.getService('AppendProcess'),
      container.getService('StringSink')
    );
  }
  */

/*
  constructor(source, connector, process, sink) {
  super();
  this.source = source;
  this.connector = new Connector();
  this.process = process;
  this.sink = sink;
}
*/

export class Transmission {
  constructor(config) {
    this.config = config;
    // this.container = new ServiceContainer();
    //    this.services = {}
    logger.log("Transmission.constructTransmission : " + JSON.stringify(config))
  }

  /*
  static __inject(container) {
      logger.log("SimplePipe.__inject")
      //     container.getService('Connector'),
      return new this(
          getService('StringSource'),
          getService('AppendProcess'),
          getService('StringSink')
      )
  }

  static services = []

  static __inject(container) {
 
    this.services.forEach(serviceName => {
      this.prototype[serviceName] = container.getService(serviceName)
    })
  }
*/

  /*
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
  */

  build() {
    // this.connector.connect(this.source, this.process)
    // this.connector.connect(this.process, this.sink)

    // Example transmission construction logic using the factory
    //        this.services = this.config.map(serviceConfig => ServiceFactory.createService(serviceConfig.type, serviceConfig));
    //   this.services = this.config.map(serviceConfig => ServiceFactory.createService(serviceConfig.type, serviceConfig));
    //  logger.log("##############this.services : " + Reveal.asMarkdown(this.services))
    logger.log("Transmission.build : " + JSON.stringify(this.config))
    this.services = {}

    this.config.forEach(item => {
      const serviceName = item.node;

      this.services[serviceName] = ServiceFactory.createService(serviceName, 'a config')

      const service = ServiceFactory.createService(serviceName, item.config)
      logger.log("Transmission.build : " + serviceName + " : " + Reveal.asMarkdown(service))


      service.injectInto(this)


      //Reveal.log("Transmission.build : " + serviceName + " : " + JSON.stringify(this.services[serviceName]))
      logger.log("Transmission.build : " + serviceName + " : " + Reveal.asMarkdown(service))
    })
  }

  getService(serviceName) {
    logger.log("ServiceContainer.getService : " + serviceName)
    logger.log("\n : this.instances : " + JSON.stringify(this.instances))
    //     logger.log("\n : this.instances : " + JSON.stringify(this.instances))


    // Create a service instance if one doesn't already exist
    if (!this.instances[serviceName]) {
      // Find the specific configuration for this service
      const serviceConfig = this.transmission.find(item => item.node.toLowerCase() === serviceName.toLowerCase());
      logger.log("*** serviceConfig : " + JSON.stringify(serviceConfig))
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
