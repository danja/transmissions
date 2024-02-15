
//import { Connector } from "../services/Connector.js";
import logger from "../utils/Logger.js"
import { Reveal } from '../utils/Reveal.js'
//import { Injectable } from './Injectable';


export class Executor {

    constructor(transmission) {
        this.transmission = transmission
    }

    execute() {
        // Execute the transmission
        logger.log("SOURCE : " + Reveal.asMarkdown(this.source))
        logger.log("inputFilePath : " + inputFilePath)
        let input = this.source.read(inputFilePath)
        // let result = this.connector.executeTransmission(this.source, input);
        return executeService(service, input)
    }

    executeService(service, input) {
        let output = input;
        const nextServices = this.getNextServices(service);

        nextServices.forEach(nextService => {
            output = nextService.process ? nextService.process(output) : output;
            if (nextService instanceof Sink) {
                nextService.write(output);
            } else {
                output = this.executeService(nextService, output);
            }
        });

        return output;
    }

    getNextServices(service) {
        return this.transmission.connections[service.constructor.name] || [];
    }
}
