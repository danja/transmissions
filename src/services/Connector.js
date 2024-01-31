import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'
import { Sink } from './Sink.js';

import { Injectable } from '../di/Injectable.js';

export class Connector extends Injectable {
    constructor() {
        super();
        this.connections = {};
    }

    connect(fromService, toService) {
        logger.log("****** Connector.connect : \n***" + Reveal.asJSON(fromService) + "\n to \n" + Reveal.asJSON(toService))
        if (!this.connections[fromService.constructor.name]) {
            this.connections[fromService.constructor.name] = [];
        }
        this.connections[fromService.constructor.name].push(toService);
        logger.log("Connector.connections : " + JSON.stringify(this.connections))
    }

    getNextServices(service) {
        return this.connections[service.constructor.name] || [];
    }

    // move to Transmission, change execute in SimplePipe.run *******************************************************
    executeTransmission(service, input) {
        let output = input;
        const nextServices = this.getNextServices(service);

        nextServices.forEach(nextService => {
            output = nextService.process ? nextService.process(output) : output;
            if (nextService instanceof Sink) {
                nextService.write(output);
            } else {
                output = this.executeTransmission(nextService, output);
            }
        });

        return output;
    }
}
