import axios from 'axios';
import nunjucks from 'nunjucks';
import crypto from 'crypto';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';
import ns from '../../utils/ns.js';
import SessionEnvironment from './SessionEnvironment.js';

class SPARQLUpdate extends Processor {
    constructor(config) {
        super(config);
        this.env = new SessionEnvironment(this);
    }

    async process(message) {
        if (!this.env.endpoints) {
            await this.env.loadEndpoints(message.rootDir);
        }

        const endpoint = this.env.getUpdateEndpoint();
        const template = await this.env.getTemplate(
            message.rootDir,
            this.getProperty(ns.trn.templateFilename)
        );

        const now = new Date().toISOString();
        const updateData = {
            id: crypto.randomUUID(),
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
                    'Authorization': this.env.getBasicAuthHeader(endpoint)
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
}

export default SPARQLUpdate;