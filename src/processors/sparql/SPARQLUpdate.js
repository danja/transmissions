import axios from 'axios';
import nunjucks from 'nunjucks';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';
import ns from '../../utils/ns.js';
import SessionEnvironment from './SessionEnvironment.js'

/**
 * @class SPARQLUpdate
 * @extends Processor
 * @classdesc
 * **SPARQL Update Query Processor**
 *
 * Executes SPARQL UPDATE operations against a configured endpoint using templates.
 *
 * #### __*Input*__
 * * **`message.content`** - Content to be stored
 * * **`message.meta`** - Optional metadata (title, author, etc.)
 *
 * #### __*Output*__
 * * **`message.updateStatus`** - 'success' or 'error'
 * * **`message.updateResponse`** - Response from SPARQL endpoint
 *
 * #### __*Behavior*__
 * * Generates unique IDs for new resources
 * * Renders UPDATE query from template
 * * Executes update with Basic Auth
 * * Handles default values for missing fields
 */
class SPARQLUpdate extends Processor {
    constructor(config) {
        super(config);
        this.endpoints = null;
    }



    async process(message) {
        if (!this.endpoints) {
            await this.loadEndpoints(message.rootDir); // TODO figure paths
        }

        const endpoint = this.getUpdateEndpoint();
        const template = await this.getTemplate(message.rootDir)

        const now = new Date().toISOString();
        const updateData = {
            id: this.generateId(),
            title: message.meta?.title || 'Untitled Post',
            content: message.content,
            published: now,
            modified: now,
            author: {
                name: 'System User',
                email: 'system@example.com'
            },
            ...message
        };

        const update = nunjucks.renderString(template, updateData);

        try {
            const response = await axios.post(endpoint.url, update, {
                headers: {
                    'Content-Type': 'application/sparql-update',
                    'Authorization': `Basic ${Buffer.from(
                        `${endpoint.credentials.user}:${endpoint.credentials.password}`
                    ).toString('base64')}`
                }
            });

            message.updateStatus = response.status === 200 ? 'success' : 'error';
            message.updateResponse = response.data;

            return this.emit('message', message);
        } catch (error) {
            logger.error('SPARQL update error:', error);
            throw error;
        }
    }

    generateId() {
        return crypto.randomUUID();
    }

    async loadEndpoints(dir) {
        const settingsPath = this.getProperty(ns.trn.endpointSettings);
        const filePath = path.join(dir, settingsPath);
        const data = await fs.readFile(filePath, 'utf8');
        this.endpoints = JSON.parse(data);
    }

    getUpdateEndpoint() {
        return this.endpoints.find(e => e.type === 'update');
    }

    async getTemplate(dir) {
        const templateFile = path.join(dir, this.getProperty(ns.trn.templateFilename))
        return await fs.readFile(templateFile, 'utf8');
    }
}

export default SPARQLUpdate;