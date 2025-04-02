import axios from 'axios';
import nunjucks from 'nunjucks';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';
import ns from '../../utils/ns.js';
import SessionEnvironment from './SessionEnvironment.js';

class SPARQLSelect extends Processor {
    constructor(config) {
        super(config);
        this.env = new SessionEnvironment(this);
    }

    async process(message) {
        if (!this.env.endpoints) {
            await this.env.loadEndpoints(message.rootDir);
        }

        const endpoint = this.env.getQueryEndpoint();
        const template = await this.env.getTemplate(
            message.rootDir,
            await this.getProperty(ns.trn.templateFilename)
        );

        const queryData = {
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            ...message
        };

        const query = nunjucks.renderString(template, queryData);

        try {
            const response = await axios.post(endpoint.url, query, {
                headers: {
                    'Content-Type': 'application/sparql-query',
                    'Accept': 'application/json',
                    'Authorization': this.env.getBasicAuthHeader(endpoint)
                }
            });

            message.queryResults = response.data;
            return this.emit('message', message);
        } catch (error) {
            logger.error('SPARQL query error:', error);
            throw error;
        }
    }
}

export default SPARQLSelect;