import { Injectable } from '../di/Injectable.js';

export class Connector extends Injectable {
    constructor(sourceClass, sinkClass) {
        super()
        this.sourceClass = sourceClass
        this.sinkClass = sinkClass
    }
}