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

        const endpoint = await this.getUpdateEndpoint(message)
        // Ensure dir is always a string: prefer targetPath, then rootDir, then targetDir, then appPath, then cwd
        const dir = super.getProperty(ns.trn.targetPath, message.rootDir) || message.targetDir || message.appPath || process.cwd()

        const templateFilename = super.getProperty(ns.trn.templateFilename, null)
        const template = await this.env.getTemplate(dir, templateFilename)
        logger.trace(`   process template = ${template}`)

        const dataField = super.getProperty(ns.trn.dataBlock, 'contentBlocks')
        let updateData = message
        if (typeof dataField === 'string' && dataField in message) {
            updateData = message[dataField]
        }
        updateData.graph = super.getProperty(ns.trn.graph, 'http://example.org/graph')
        logger.debug(`  updateData.graph = ${updateData.graph}`)
        //  logger.v(updateData)

        const escape = super.getProperty(ns.trn.escape, false)
        if (escape) { // TODO unhackify
            logger.debug(`---   escaping`)
            const replacements = this.escaper.getReplacementList('SPARQL')
            message.contentBlocks.content =
                this.escaper.escape(message.contentBlocks.content, replacements)
        }

        nunjucks.configure({ autoescape: true })
        var update = nunjucks.renderString(template, updateData)

        // logger.v(updateData)
        // process.exit()

        logger.trace(`dataField = ${dataField}`)
        //logger.debug(`updateData = `)
        // logger.v(updateData)
        //  logger.log(`update = ${update}`)
        logger.debug(`endpoint.url = ${endpoint.url}`)

        update = RDFUtils.escapeAngleBracketURIs(update) // TODO unhackify

        let response
        try {
            response = await axios.post(endpoint.url, update, {
                headers: await this.makeHeaders(endpoint)
            })
        } catch (e) {
            logger.error(`Update ${this.id} \n${e.message}\nvvvvvvvv`)
            logger.log(update)
            logger.error(`^^^^^^^^`)
            return
        }

        // https://axios-http.com/docs/res_schema
        if (response.status === 200 || response.status === 204) {
            logger.debug(`SPARQLUpdate success: ${response.status} ${response.statusText}`)
            message.updateStatus = 'success'
            return this.emit('message', message)
        }
        logger.trace(`SPARQLUpdate error, response : ${response.status} ${response.statusText}
            ${response.headers}`)
        //    logger.reveal(response)
    }

    async getUpdateEndpoint(message) {
        if (!this.env.endpoints) {
            // Ensure dir is always a string
            const dir = this.getProperty(ns.trn.targetPath, message.rootDir) || message.targetDir || message.appPath || process.cwd()
            logger.debug(`SPARQLUpdate.getUpdateEndpoint, dir = ${dir}`)
            await this.env.loadEndpoints(dir)
        }
        return this.env.getUpdateEndpoint()
    }

    async makeHeaders(endpoint) {
        return {
            'Content-Type': 'application/sparql-update',
            'Authorization': this.env.getBasicAuthHeader(endpoint)
        }
    }
}

export default SPARQLUpdate