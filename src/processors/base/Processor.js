import { EventEmitter } from 'events';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';
import ProcessorSettings from './ProcessorSettings.js';

class Processor extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.settee = new ProcessorSettings(this.config);
        //  this.settee = null;
        this.messageQueue = [];
        this.processing = false;
        this.outputs = [];
    }

    async initializeSettings() { // probably redundant
        //  this.settee = new ProcessorSettings(this.config);
    }

    async getValues(property, fallback) {
        logger.debug(`Processor.getValues looking for ${property}`);
        if (!this.settee) {
            await this.initializeSettings();
        }
        const shortName = ns.getShortname(property);
        if (this.message && this.message[shortName]) {
            return [this.message[shortName]];
        }

        this.settee.settingsNode = this.settingsNode;
        return this.settee.getValues(property, fallback);
    }

    async getProperty(property, fallback = undefined) {
        if (!this.settee) {
            await this.initializeSettings();
        }
        logger.log(`Processor.getProperty, property = ${property}`);
        //  logger.log(`Processor.getProperty, this.settee = ${this.settee}`);
        // logger.reveal(this.settee);
        //  logger.log(`Processor.getProperty, this.settee.config = ${this.settee.config}`);
        return this.settee.getValue(property, fallback);
    }

    async preProcess(message) {
        const messageType = await await this.getProperty(ns.trn.messageType);
        if (messageType) {
            if (messageType.value) {
                message.messageType = messageType.value;
            } else {
                message.messageType = messageType;
            }
        }
        this.message = message;
    }

    async postProcess(message) { }

    async receive(message) {
        await this.enqueue(message);
    }

    async enqueue(message) {
        this.messageQueue.push({ message });
        if (!this.processing) {
            this.executeQueue();
        }
    }

    async executeQueue() {
        this.processing = true;
        while (this.messageQueue.length > 0) {
            let { message } = this.messageQueue.shift();
            message = structuredClone(message);
            this.addTag(message);

            await this.preProcess(message);
            await this.process(message);
            await this.postProcess(message);
        }
        this.processing = false;
    }

    async process(message) {
        throw new Error('process method not implemented');
    }

    addTag(message) {
        const tag = this.getTag();
        if (!message.tags) {
            message.tags = tag;
            return;
        }
        message.tags = message.tags + '.' + tag;
    }

    getTag() {
        return ns.shortName(this.id);
    }

    async emit(event, message) {
        await new Promise(resolve => {
            super.emit(event, message);
            resolve();
        });
        return message;
    }

    getOutputs() {
        const results = this.outputs;
        this.outputs = [];
        return results;
    }

    toString() {
        logger.reveal(this.settings);
        const settingsNodeValue = this.settingsNode ? this.settingsNode.value : 'none';
        return `
        *** Processor ${this.constructor.name}
                id = ${this.id}
                label = ${this.label}
                type = ${this.type}
                description = ${this.description}
                settingsNodeValue = ${settingsNodeValue}
                settings = ${this.settings}
       `
    }
}

export default Processor;