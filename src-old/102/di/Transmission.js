import { ServiceFactory } from "./ServiceFactory.js";
import { ServiceContainer } from "./ServiceContainer.js";

export class Transmission {
    constructor(config) {
        this.config = config;
        this.container = new ServiceContainer();
    }

    constructTransmission() {

        // Updated transmission construction logic using ServiceFactory


        // Example transmission construction logic using the factory
        this.services = this.config.map(serviceConfig => ServiceFactory.createService(serviceConfig.type, serviceConfig));

    }
}
