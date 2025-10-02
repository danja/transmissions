import { config } from '@dotenvx/dotenvx'
import axios from 'axios'
import nunjucks from 'nunjucks'
import fs from 'fs/promises'
import path from 'path'
import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'

// Load environment variables
config()

class SessionEnvironment {
    constructor(processor) {
        this.processor = processor
        this.endpoints = null
        this.templateCache = new Map()
    }

    async loadEndpoints(dir, override = false) {
        this.override = override
        logger.debug(`    loadEndpoints dir = ${dir}`)
        const settingsPath = this.processor.getProperty(ns.trn.endpointSettings)
        logger.debug(`    dir = ${dir}`)
        logger.debug(`    settingsPath = ${settingsPath}`)

        if (!settingsPath) {
            logger.error(`
    Endpoint settings path is undefined
    Config :
${logger.shorter(this.processor.config)}`)
            process.exit(1)
        }

        const filePath = path.join(dir, settingsPath)
        logger.debug(`SessionEnvironment.loadEndpoints filePath = ${filePath}`)
        try {
            const data = await fs.readFile(filePath, 'utf8')
            this.endpoints = JSON.parse(data)
        } catch (err) {
            logger.error(`Failed to load endpoints from ${filePath}: ${err.message}`)
            process.exit(1)
        }
    }

    getQueryEndpoint() {
        const endpoint = this.endpoints.find(e => e.type === 'query')
        return this.applyEnvOverrides(endpoint)
    }

    getUpdateEndpoint() {
        const endpoint = this.endpoints.find(e => e.type === 'update')
        return this.applyEnvOverrides(endpoint)
    }

    applyEnvOverrides(endpoint) {
        // if (!endpoint) return endpoint

        // Use endpoints.json by default, only override if this.override is true
        if (this.override) {
            // Override with environment variables
            return {
                ...endpoint,
                url: `http://${process.env.SPARQL_HOST}:${process.env.SPARQL_PORT}/test`,
                credentials: {
                    user: process.env.SPARQL_USER,
                    password: process.env.SPARQL_PASSWORD
                }
            }
        } else {
            // Use endpoint from endpoints.json file
            return endpoint
        }

    }

    async getTemplate(dir, templateFilename) {

        logger.debug(`SessionEnvironment.getTemplate dir = ${dir}`)
        logger.debug(`SessionEnvironment.getTemplate templateFilename = ${templateFilename}`)

        const cacheKey = path.join(dir, templateFilename)

        if (this.templateCache.has(cacheKey)) {
            return this.templateCache.get(cacheKey)
        }

        try {
            const template = await fs.readFile(cacheKey, 'utf8')
            this.templateCache.set(cacheKey, template)
            logger.debug(`SessionEnvironment.getTemplate cacheKey = ${cacheKey}`)
            logger.debug(`SessionEnvironment.getTemplate template = ${template}`)
            return template
        } catch (err) {
            logger.error(`Failed to load template from ${cacheKey}: ${err.message}`)
            process.exit(1)
        }
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