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
        const dir = super.getProperty(ns.trn.targetPath, message.rootDir)
        const dataField = super.getProperty(ns.trn.dataBlock)
        message.graph = await super.getProperty(ns.trn.graph, 'default')
        logger.debug(`  message.graph = ${message.graph}`)
        const escape = super.getProperty(ns.trn.escape)
        const templateFilename = await this.getProperty(ns.trn.templateFilename)

        logger.trace(`   endpoint = ${endpoint}`)

        const template = await this.env.getTemplate(dir, templateFilename)
        //  message.contentBlocks.graph = graph

        logger.debug(`   process template = ${template}`)

        const now = new Date().toISOString()
        const updateID = crypto.randomUUID()


        const updateData = message[dataField] || message
        logger.debug(`---   updateData = ${updateData}`)
        //  logger.reveal(message)


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
            const dir = this.getProperty(ns.trn.targetPath, message.rootDir)
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