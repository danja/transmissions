import axios from 'axios'
import nunjucks from 'nunjucks'
import crypto from 'crypto'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'
import ns from '../../utils/ns.js'
import SessionEnvironment from './SessionEnvironment.js'

class SPARQLUpdate extends Processor {
    constructor(config) {
        super(config)
        this.env = new SessionEnvironment(this)
    }

    async process(message) {
        logger.debug(`\nSPARQLUpdate.process`)

        const endpoint = await this.getUpdateEndpoint(message)
        logger.debug(`SPARQLUpdate.process endpoint = ${endpoint}`)

        const dir = this.getProperty(ns.trn.targetPath, message.rootDir)
        const template = await this.env.getTemplate(
            dir,
            await this.getProperty(ns.trn.templateFilename)
        )
        logger.debug(`\nSPARQLUpdate.process template = ${template}`)

        const now = new Date().toISOString()

        const updateID = crypto.randomUUID()

        const dataField = super.getProperty(ns.trn.dataBlock)
        const updateData = message[dataField]

        const update = nunjucks.renderString(template, updateData)

        logger.debug(`dataField = ${dataField}`)
        logger.debug(`updateData = `)
        //   logger.reveal(updateData)
        logger.debug(`update = ${update}`)
        //   process.exit()
        const response = await axios.post(endpoint.url, update, {
            headers: await this.makeHeaders(endpoint)
        })

        // https://axios-http.com/docs/res_schema
        if (response.status === 200 || response.status === 204) {
            message.updateStatus = 'success'
            return this.emit('message', message)
        }
        logger.debug(`SPARQLUpdate error, response : ${response.status} ${response.statusText}
            ${response.headers}`)
        //    logger.reveal(response)
    }

    async getUpdateEndpoint(message) {
        // TODO maybe check message & config too?
        if (!this.env.endpoints) {
            await this.env.loadEndpoints(message.rootDir)
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