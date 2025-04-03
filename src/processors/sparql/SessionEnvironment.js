import axios from 'axios'
import nunjucks from 'nunjucks'
import fs from 'fs/promises'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

class SessionEnvironment {
    constructor(processor) {
        this.processor = processor
        this.endpoints = null
        this.templateCache = new Map()
    }

    async loadEndpoints(dir) {
        logger.debug(`    loadEndpoints dir = ${dir}`)
        const settingsPath = this.processor.getProperty(ns.trn.endpointSettings)
        logger.debug(`    dir = ${dir}`)
        logger.debug(`    settingsPath = ${settingsPath}`)

        if (!settingsPath) {
            throw new Error(`
    Endpoint settings path is undefined
    Config :
${logger.shorter(this.processor.config)}`)
        }

        const filePath = path.join(dir, settingsPath)
        logger.debug(`SessionEnvironment.loadEndpoints filePath = ${filePath}`)
        const data = await fs.readFile(filePath, 'utf8')
        this.endpoints = JSON.parse(data)
    }

    getQueryEndpoint() {
        return this.endpoints.find(e => e.type === 'query')
    }

    getUpdateEndpoint() {
        // logger.debug(`this.endpoints = ${this.endpoints}`)
        const ep = this.endpoints.find(e => e.type === 'update')
        // logger.log(`update endpoint = ${ep}`)
        // logger.reveal(ep)
        return ep
    }

    async getTemplate(dir, templateFilename) {

        logger.debug(`SessionEnvironment.getTemplate dir = ${dir}`)
        logger.debug(`SessionEnvironment.getTemplate templateFilename = ${templateFilename}`)

        const cacheKey = path.join(dir, templateFilename)

        if (this.templateCache.has(cacheKey)) {
            return this.templateCache.get(cacheKey)
        }

        const template = await fs.readFile(cacheKey, 'utf8')
        this.templateCache.set(cacheKey, template)
        logger.debug(`SessionEnvironment.getTemplate cacheKey = ${cacheKey}`)
        logger.debug(`SessionEnvironment.getTemplate template = ${template}`)
        return template
    }

    clearTemplateCache() {
        this.templateCache.clear()
    }

    // getProperty(property) {
    //   return property;
    //}

    getBasicAuthHeader(endpoint) {
        return `Basic ${Buffer.from(
            `${endpoint.credentials.user}:${endpoint.credentials.password}`
        ).toString('base64')}`
    }
}

export default SessionEnvironment