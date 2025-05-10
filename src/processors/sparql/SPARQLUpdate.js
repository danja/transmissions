import axios from 'axios'
import nunjucks from 'nunjucks'
import crypto from 'crypto'
import logger from '../../utils/Logger.js'
import SlowableProcessor from '../../model/SlowableProcessor.js'
import ns from '../../utils/ns.js'
import SessionEnvironment from './SessionEnvironment.js'
// TODO unhack
import Escaper from '../text/Escaper.js'

class SPARQLUpdate extends SlowableProcessor {
    constructor(config) {
        super(config)
        this.env = new SessionEnvironment(this)
        // TODO unhack
        this.escaper = new Escaper()
    }

    async process(message) {
        logger.debug(`\n[[SPARQLUpdate.process]]`)

        const endpoint = await this.getUpdateEndpoint(message)
        // Ensure dir is always a string: prefer targetPath, then rootDir, then targetDir, then appPath, then cwd
        const dir = super.getProperty(ns.trn.targetPath, message.rootDir) || message.targetDir || message.appPath || process.cwd()
        const dataField = super.getProperty(ns.trn.dataBlock, null)
        message.graph = await super.getProperty(ns.trn.graph, 'default')
        logger.debug(`  message.graph = ${message.graph}`)
        const escape = super.getProperty(ns.trn.escape, false)
        const templateFilename = await this.getProperty(ns.trn.templateFilename, null)

        logger.trace(`   endpoint = ${endpoint}`)

        const template = await this.env.getTemplate(dir, templateFilename)
        //  message.contentBlocks.graph = graph

        logger.trace(`   process template = ${template}`)

        // Remove unused variables
        // const now = new Date().toISOString()
        // const updateID = crypto.randomUUID()

        // Fix: dataField may be array or undefined
        let updateData = message
        if (typeof dataField === 'string' && dataField in message) {
            updateData = message[dataField]
        }
        logger.debug(`---   updateData = ${updateData}`)
        //  logger.reveal(message)
        // process.exit()

        if (escape) { // TODO unhackify
            logger.debug(`---   escaping`)
            const replacements = this.escaper.getReplacementList('SPARQL')
            message.contentBlocks.content = this.escaper.escape(message.contentBlocks.content, replacements)
        }

        nunjucks.configure({ autoescape: true })
        const update = nunjucks.renderString(template, updateData)

        logger.trace(`dataField = ${dataField}`)
        logger.trace(`updateData = `)
        //  logger.reveal(updateData)
        logger.debug(`update = ${update}`)

        const response = await axios.post(endpoint.url, update, {
            headers: await this.makeHeaders(endpoint)
        })

        // https://axios-http.com/docs/res_schema
        if (response.status === 200 || response.status === 204) {
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