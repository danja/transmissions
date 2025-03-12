import axios from 'axios'
import nunjucks from 'nunjucks'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'
import SessionEnvironment from './SessionEnvironment.js'

class SPARQLSelect extends Processor {
    constructor(config) {
        super(config)
        this.env = new SessionEnvironment(this)
    }

    async getQueryEndpoint(message) {
        if (!this.env.endpoints) {
            const dir = this.getProperty(ns.trn.targetPath, message.rootDir)
            await this.env.loadEndpoints(dir)
        }
        return this.env.getQueryEndpoint()
    }

    async process(message) {

        const endpoint = await this.getQueryEndpoint(message)
        const dir = this.getProperty(ns.trn.targetPath, message.rootDir)
        const template = await this.env.getTemplate(
            dir,
            await this.getProperty(ns.trn.templateFilename)
        )

        const queryData = {
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            ...message
        }

        const query = nunjucks.renderString(template, queryData)

        try {
            const response = await axios.post(endpoint.url, query, {
                headers: {
                    'Content-Type': 'application/sparql-query',
                    'Accept': 'application/json',
                    'Authorization': this.env.getBasicAuthHeader(endpoint)
                }
            })

            message.queryResults = response.data
            return this.emit('message', message)
        } catch (error) {
            logger.error('SPARQL query error:', error)
            throw error
        }
    }
}

export default SPARQLSelect