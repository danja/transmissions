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
        const dir = await this.getProperty(ns.trn.targetPath, message.rootDir)
        const templateFilename = await this.getProperty(ns.trn.templateFilename)
        const dataField = await this.getProperty(ns.trn.dataField)
        const graph = await this.getProperty(ns.trn.graph, '?g')

        const template = await this.env.getTemplate(dir, templateFilename)

        const queryData = message[dataField] || message
        queryData.graph = graph
        queryData.startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

        const query = nunjucks.renderString(template, queryData)
        logger.debug(`query = ${query}`)
        logger.debug(`endpoint.url = ${endpoint.url}`)
        try {
            const response = await axios.post(endpoint.url, query, {
                headers: {
                    'Content-Type': 'application/sparql-query',
                    'Accept': 'application/json',
                    'Authorization': this.env.getBasicAuthHeader(endpoint)
                }
            })

            logger.debug(`response.data = ${response.data}`)
            //  logger.reveal(response.data)
            message.queryResults = response.data
            return this.emit('message', message)
        } catch (error) {
            logger.error('SPARQL query error:', error)
            throw error
        }
    }
}

export default SPARQLSelect