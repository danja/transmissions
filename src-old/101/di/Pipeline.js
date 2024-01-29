import { ServiceFactory } from "./ServiceFactory.js";
import { ServiceContainer } from "./ServiceContainer.js";

export class Pipeline {
    constructor(config) {
        this.config = config;
        this.container = new ServiceContainer();
    }

    constructPipeline() {

        // Updated pipeline construction logic using ServiceFactory


        // Example pipeline construction logic using the factory
        this.services = this.config.map(serviceConfig => ServiceFactory.createService(serviceConfig.type, serviceConfig));

    }
}
