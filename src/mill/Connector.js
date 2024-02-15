import logger from '../utils/Logger.js'
import { Reveal } from '../utils/Reveal.js'
import { Sink } from '../services/Sink.js';

import { Injectable } from './Injectable.js';

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
}
