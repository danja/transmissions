// src/processors/sparql/SPARQLSelect.js

import axios from 'axios'
import nunjucks from 'nunjucks'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'
import SessionEnvironment from './SessionEnvironment.js'

/**
 * @class SPARQLSelect
 * @extends Processor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Executes SPARQL SELECT queries against a configured endpoint and injects the results into the message object.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.sparqlEndpoint`** - The SPARQL endpoint URL (optional, can be resolved from environment)
 * * **`ns.trn.queryTemplate`** - Nunjucks template for query construction (optional)
 *
 * #### __*Input*__
 * * **`message.query`** - The SPARQL SELECT query or template data
 * * **`message.rootDir`** - The root directory for resolving endpoint configs (optional)
 *
 * #### __*Output*__
 * * **`message.results`** - The result set from the SPARQL SELECT query
 * * **`message`** - The original message, enriched with query results
 *
 * #### __*Behavior*__
 * * Loads SPARQL endpoint configuration if not already set
 * * Renders query with Nunjucks if template provided
 * * Executes SELECT query via HTTP and parses results
 * * Logs and emits enriched message
 *
 * #### __*Side Effects*__
 * * Network requests to SPARQL endpoint
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*ToDo*__
 * * Add error handling for endpoint/network failures
 * * Support for additional SPARQL result formats
 */

class SPARQLSelect extends Processor {
    constructor(config) {
        super(config)
        this.env = new SessionEnvironment(this)
    }

    async getQueryEndpoint(message) {
        if (!this.env.endpoints) {
            // Ensure dir is always a string
            const dir = this.getProperty(ns.trn.targetPath, message.rootDir) || message.targetDir || message.appPath || process.cwd()
            logger.debug(`SPARQLQuery.getQueryEndpoint, dir = ${dir}`)
            await this.env.loadEndpoints(dir)
        }
        return this.env.getQueryEndpoint()
    }

    async process(message) {

        const endpoint = await this.getQueryEndpoint(message)

        const dir = super.getProperty(ns.trn.targetPath, message.rootDir) || message.targetDir || message.appPath || process.cwd()

        const templateFilename = super.getProperty(ns.trn.templateFilename, dir)
        const template = await this.env.getTemplate(dir, templateFilename)
        logger.trace(`   process template = ${template}`)

        const dataField = super.getProperty(ns.trn.dataField)
        const graph = super.getProperty(ns.trn.graph, '?g')

        const queryData = message[dataField] || message
        queryData.graph = graph
        queryData.startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

        const query = nunjucks.renderString(template, queryData)
        logger.debug(`query = ${query}`)
        logger.debug(`endpoint.url = ${endpoint.url}`)
        try {
            const useForm = super.getProperty(ns.trn.sparqlUseForm, 'false') === 'true'
            const contentType = useForm ? 'application/x-www-form-urlencoded' : 'application/sparql-query'
            const body = useForm ? `query=${encodeURIComponent(query)}` : query

            const response = await axios.post(endpoint.url, body, {
                headers: {
                    'Content-Type': contentType,
                    'Accept': 'application/json',
                    'Authorization': this.env.getBasicAuthHeader(endpoint)
                }
            })

            //  logger.error(`response.data = ${response.data}`)
            //    logger.v(response.data)
            logger.log(`    ${response.data.results.bindings.length} query hits`)
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
