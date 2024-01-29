import { Sink } from './Sink.js';

import { Injectable } from '../di/Injectable.js';

export class Connector extends Injectable {
    constructor() {
        super();
        this.connections = {};
    }

    connect(fromService, toService) {
        if (!this.connections[fromService.constructor.name]) {
            this.connections[fromService.constructor.name] = [];
        }
        this.connections[fromService.constructor.name].push(toService);
    }

    getNextServices(service) {
        return this.connections[service.constructor.name] || [];
    }

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
