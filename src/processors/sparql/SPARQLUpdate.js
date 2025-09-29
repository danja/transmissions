// src/processors/sparql/SPARQLUpdate.js

import axios from 'axios'
import nunjucks from 'nunjucks'
import crypto from 'crypto'
import logger from '../../utils/Logger.js'
import SlowableProcessor from '../../model/SlowableProcessor.js'
import ns from '../../utils/ns.js'
import RDFUtils from '../../utils/RDFUtils.js'
import SessionEnvironment from './SessionEnvironment.js'
// TODO unhack
import Escaper from '../text/Escaper.js'

/**
 * @class SPARQLUpdate
 * @extends SlowableProcessor
 * @classdesc
 * **A Transmissions Processor**
 *
 * Executes SPARQL UPDATE queries (INSERT/DELETE) against a configured endpoint, optionally templating queries and supporting slow/batch operations.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.sparqlEndpoint`** - The SPARQL endpoint URL (optional, can be resolved from environment)
 * * **`ns.trn.updateTemplate`** - Nunjucks template for update query construction (optional)
 * * **`ns.trn.batchSize`** - Number of updates to send per batch (optional)
 *
 * #### __*Input*__
 * * **`message.update`** - The SPARQL UPDATE query or template data
 * * **`message.rootDir`** - The root directory for resolving endpoint configs (optional)
 *
 * #### __*Output*__
 * * **`message.result`** - The result/status of the update operation
 * * **`message`** - The original message, enriched with update results
 *
 * #### __*Behavior*__
 * * Loads SPARQL endpoint configuration if not already set
 * * Renders update query with Nunjucks if template provided
 * * Executes UPDATE query via HTTP
 * * Supports batching and slow-mode for large operations
 * * Logs and emits enriched message
 *
 * #### __*Side Effects*__
 * * Network requests to SPARQL endpoint
 *
 * #### __*Tests*__
 * * (Add test references here if available)
 *
 * #### __*Example Configuration*__
 * :updateBookmark a :ConfigSet ;
 * :loglevel "debug" ;
 *  :delay "100" ;
 *  :dataBlock "resource" ;
 *  :templateFilename "data/update-bookmark.njk" ;
 *  :noCache "true" ; # always reload endpoints
 *  :endpointSettings "data/endpoints.json" ;
 *  :graph <http://hyperdata.it/content> .
 *
 * #### __*ToDo*__
 * * Add error handling for endpoint/network failures
 * * Improve batching and slow-mode logic
 * * Remove 'unhack' code and refactor Escaper usage
 */

class SPARQLUpdate extends SlowableProcessor {
    constructor(config) {
        super(config)
        this.env = new SessionEnvironment(this)
        // TODO unhack
        this.escaper = new Escaper()
    }

    // maybe later
    // const now = new Date().toISOString()
    // const updateID = crypto.randomUUID()

    async process(message) {
        logger.debug(`\n[[SPARQLUpdate.process]]`)
        logger.debug(`SPARQLUpdate: Processing message with keys: ${Object.keys(message)}`)

        try {
            logger.debug(`SPARQLUpdate: Getting update endpoint...`)

            const endpoint = await this.getUpdateEndpoint(message)
            logger.debug(`SPARQLUpdate: Got endpoint: ${JSON.stringify(endpoint)}`)

            // Ensure dir is always a string: prefer targetPath, then rootDir, then targetDir, then appPath, then cwd
            const dir = super.getProperty(ns.trn.targetPath, message.rootDir) || message.targetDir || message.appPath || process.cwd()
            logger.debug(`SPARQLUpdate: Using directory: ${dir}`)

            logger.debug(`SPARQLUpdate: Getting template filename...`)
            const templateFilename = super.getProperty(ns.trn.templateFilename, null)
            logger.debug(`SPARQLUpdate: Template filename: ${templateFilename}`)

            logger.debug(`SPARQLUpdate: Loading template...`)
            const template = await this.env.getTemplate(dir, templateFilename)
            logger.debug(`SPARQLUpdate: Template loaded, length: ${template?.length || 0}`)
            logger.trace(`   process template = ${template}`)

            logger.debug(`SPARQLUpdate: Preparing update data...`)
            const dataField = super.getProperty(ns.trn.dataBlock, 'contentBlocks')
            logger.debug(`SPARQLUpdate: Data field: ${dataField}`)

            let updateData = message
            if (typeof dataField === 'string' && dataField in message) {
                updateData = message[dataField]
                logger.debug(`SPARQLUpdate: Using data from field '${dataField}'`)
            } else {
                logger.debug(`SPARQLUpdate: Using entire message as update data`)
            }

            updateData.graph = super.getProperty(ns.trn.graph, 'http://example.org/graph')
            logger.debug(`SPARQLUpdate: updateData.graph = ${updateData.graph}`)

            const escape = super.getProperty(ns.trn.escape, false)
            logger.debug(`SPARQLUpdate: Escape setting: ${escape}`)

            if (escape) { // TODO unhackify
                logger.debug(`SPARQLUpdate: Escaping content...`)
                const replacements = this.escaper.getReplacementList('SPARQL')
                message.contentBlocks.content =
                    this.escaper.escape(message.contentBlocks.content, replacements)
                logger.debug(`SPARQLUpdate: Content escaped`)
            }

            /* ???
            if (message.contentBlocks?.uri) {
                logger.log(`URI = ${message.contentBlocks.uri}`)
            } else {
                logger.debug(`SPARQLUpdate: No URI found in message.contentBlocks`)
            }
                */

            logger.debug(`SPARQLUpdate: Rendering template with nunjucks...`)
            nunjucks.configure({ autoescape: true })
            var update = nunjucks.renderString(template, updateData)
            logger.debug(`SPARQLUpdate: Template rendered, update length: ${update?.length || 0}`)

            if (update.includes('grepword')) logger.log(update)

            logger.trace(`dataField = ${dataField}`)
            logger.debug(`SPARQLUpdate: endpoint.url = ${endpoint.url}`)

            logger.debug(`SPARQLUpdate: Escaping angle bracket URIs...`)
            const updateEscaped = RDFUtils.escapeAngleBracketURIs(update) // TODO unhackify
            logger.debug(`SPARQLUpdate: URIs escaped, making HTTP request...`)

            logger.debug(`SPARQLUpdate: Preparing headers...`)
            const headers = await this.makeHeaders(endpoint)
            logger.debug(`SPARQLUpdate: Headers prepared: ${JSON.stringify(headers)}`)

            let response
            try {
                logger.debug(`SPARQLUpdate: Sending POST request to ${endpoint.url}`)
                response = await axios.post(endpoint.url, updateEscaped, { headers })
                logger.debug(`SPARQLUpdate: HTTP request completed with status: ${response.status}`)
            } catch (e) {
                logger.error(`SPARQLUpdate: HTTP request failed - ${e.message}`)
                logger.error(`Update ${this.id} \n${e.message}\nvvvvvvvv`)
                logger.log(e)
                logger.log(`Update was :\n${update}`)
                logger.error(`^^^^^^^^`)
                return
            }

            // https://axios-http.com/docs/res_schema
            if (response.status === 200 || response.status === 204) {
                logger.debug(`SPARQLUpdate success: ${response.status} ${response.statusText}`)
                message.updateStatus = 'success'
                logger.debug(`SPARQLUpdate: Emitting success message...`)
                return this.emit('message', message)
            } else {
                logger.error(`SPARQLUpdate error: ${response.status} ${response.statusText}`)
                logger.debug(`SPARQLUpdate: Not emitting message due to error status`)
            }
        } catch (error) {
            logger.error(`SPARQLUpdate: Unexpected error in process(): ${error.message}`)
            logger.error(`SPARQLUpdate: Error stack: ${error.stack}`)
            // Don't emit message on unexpected error
            return
        }
        //    logger.reveal(response)
    }

    async getUpdateEndpoint(message) {
        logger.debug(`SPARQLUpdate.getUpdateEndpoint: Starting endpoint resolution`)
        const override = this.getProperty(ns.trn.noCache, null)
        if (!this.env.endpoints || override) { // 
            logger.debug(`SPARQLUpdate.getUpdateEndpoint: No endpoints cached, loading from config`)
            // Ensure dir is always a string
            const dir = this.getProperty(ns.trn.targetPath, message.rootDir) || message.targetDir || message.appPath || process.cwd()
            logger.debug(`SPARQLUpdate.getUpdateEndpoint: Using directory = ${dir}`)

            try {
                await this.env.loadEndpoints(dir, override)
                logger.debug(`SPARQLUpdate.getUpdateEndpoint: Endpoints loaded successfully`)
            } catch (error) {
                logger.error(`SPARQLUpdate.getUpdateEndpoint: Failed to load endpoints: ${error.message}`)
                throw error
            }
        } else {
            logger.debug(`SPARQLUpdate.getUpdateEndpoint: Using cached endpoints`)
        }

        const endpoint = this.env.getUpdateEndpoint()
        logger.debug(`SPARQLUpdate.getUpdateEndpoint: Returning endpoint: ${JSON.stringify(endpoint)}`)
        return endpoint
    }

    async makeHeaders(endpoint) {
        logger.debug(`SPARQLUpdate.makeHeaders: Creating headers for endpoint`)
        logger.debug(`SPARQLUpdate.makeHeaders: Endpoint has credentials: ${!!endpoint?.credentials}`)

        const authHeader = this.env.getBasicAuthHeader(endpoint)
        logger.debug(`SPARQLUpdate.makeHeaders: Authorization header created: ${authHeader ? 'Yes' : 'No'}`)

        const headers = {
            'Content-Type': 'application/sparql-update',
            'Authorization': authHeader
        }
        logger.debug(`SPARQLUpdate.makeHeaders: Final headers prepared`)
        return headers
    }
}

export default SPARQLUpdate