import { Injectable } from '../di/Injectable.js';

export class ServiceBase extends Injectable {

    constructor(config) {
        super()
        this.config = config
    }
}




