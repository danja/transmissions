import axios from 'axios';
import nunjucks from 'nunjucks';
import fs from 'fs/promises';
import path from 'path';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';

class SessionEnvironment {
    constructor(processor) {
        this.processor = processor
        this.endpoints = null;
        this.templateCache = new Map();
    }

    async loadEndpoints(dir) {
        logger.setLogLevel('debug')

        const settingsPath = this.processor.getProperty(ns.trn.endpointSettings)
        logger.debug(`SessionEnvironment.loadEndpoints dir = ${dir}`)
        logger.debug(`SessionEnvironment.loadEndpoints settingsPath = ${settingsPath}`)
        const filePath = path.join(dir, settingsPath);
        const data = await fs.readFile(filePath, 'utf8');
        this.endpoints = JSON.parse(data);
    }

    getQueryEndpoint() {
        return this.endpoints.find(e => e.type === 'query');
    }

    getUpdateEndpoint() {
        return this.endpoints.find(e => e.type === 'update');
    }

    async getTemplate(dir, templateFilename) {
        const cacheKey = path.join(dir, templateFilename);

        if (this.templateCache.has(cacheKey)) {
            return this.templateCache.get(cacheKey);
        }

        const template = await fs.readFile(cacheKey, 'utf8');
        this.templateCache.set(cacheKey, template);
        return template;
    }

    clearTemplateCache() {
        this.templateCache.clear();
    }

    // getProperty(property) {
    //   return property;
    //}

    getBasicAuthHeader(endpoint) {
        return `Basic ${Buffer.from(
            `${endpoint.credentials.user}:${endpoint.credentials.password}`
        ).toString('base64')}`;
    }
}

export default SessionEnvironment;