import axios from 'axios'
import nunjucks from 'nunjucks'
import crypto from 'crypto'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'
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

        const template = await this.env.getTemplate(
            message.rootDir,
            await this.getProperty(ns.trn.templateFilename)
        )
        logger.debug(`SPARQLUpdate.process template = ${template}`)

        const now = new Date().toISOString()

        const updateID = crypto.randomUUID()

        logger.setLogLevel('debug')

        //logger.debug(`renderString(template = ${template}
        //  updateData = ${updateData})`)
        const dataField = super.getProperty(ns.trn.dataBlock)
        const updateData = message[dataField]

        const update = nunjucks.renderString(template, updateData)

        logger.debug(update)

        //   process.exit()
        try {
            const response = await axios.post(endpoint.url, update, {
                headers: await this.makeHeaders(endpoint)
            })

            message.updateStatus = response.status === 200 ? 'success' : 'error'
            message.updateResponse = response.data

            return this.emit('message', message)
        } catch (error) {
            logger.error('SPARQL update error:', error)
            throw error
        }
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