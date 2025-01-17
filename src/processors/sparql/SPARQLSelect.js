import axios from 'axios';
import nunjucks from 'nunjucks';
import fs from 'fs/promises';
import path from 'path';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';
import ns from '../../utils/ns.js';
import SessionEnvironment from './SessionEnvironment.js'
/**
 * @class SPARQLSelect
 * @extends Processor
 * @classdesc
 * **SPARQL Select Query Processor**
 *
 * Executes SPARQL SELECT queries against a configured endpoint using templates.
 *
 * #### __*Input*__
 * * **`message`** - Object containing variables for template rendering
 * * **`message.startDate`** - Optional date filter (defaults to 24h ago)
 *
 * #### __*Output*__
 * * **`message.queryResults`** - JSON results from SPARQL query
 *
 * #### __*Behavior*__
 * * Loads endpoint configuration from JSON file
 * * Renders SPARQL query from Nunjucks template
 * * Executes query with Basic Auth
 * * Returns results in message.queryResults
 */
class SPARQLSelect extends Processor {
    constructor(config) {
        super(config);
        this.endpoints = null;
        this.env = new SessionEnvironment()
    }

    async loadEndpoints(dir) {
        const settingsPath = this.getProperty(ns.trn.endpointSettings);
        const filePath = path.join(process.cwd(), settingsPath);
        const data = await fs.readFile(filePath, 'utf8');
        this.endpoints = JSON.parse(data);
    }



    async process(message) {
        if (!this.endpoints) {
            await this.loadEndpoints(message.rootDir);
        }

        const endpoint = this.getQueryEndpoint();

        const template = await this.getTemplate(message.rootDir)

        const queryData = {
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24h
            ...message
        };

        const query = nunjucks.renderString(template, queryData);

        try {
            const response = await axios.post(endpoint.url, query, {
                headers: {
                    'Content-Type': 'application/sparql-query',
                    'Accept': 'application/json',
                    'Authorization': `Basic ${Buffer.from(
                        `${endpoint.credentials.user}:${endpoint.credentials.password}`
                    ).toString('base64')}`
                }
            });

            message.queryResults = response.data;
            return this.emit('message', message);
        } catch (error) {
            logger.error('SPARQL query error:', error);
            throw error;
        }
    }

    async loadEndpoints(dir) {
        const settingsPath = this.getProperty(ns.trn.endpointSettings);
        const filePath = path.join(dir, settingsPath);
        const data = await fs.readFile(filePath, 'utf8');
        this.endpoints = JSON.parse(data);
    }

    getQueryEndpoint() {
        return this.endpoints.find(e => e.type === 'query');
    }

    async getTemplate(dir) {
        const templateFile = path.join(dir, this.getProperty(ns.trn.templateFilename))
        return await fs.readFile(templateFile, 'utf8');
    }
}

export default SPARQLSelect;