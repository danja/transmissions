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
        this.useEnvOverride = false // Controls whether to use environment variables
    }

    async loadEndpoints(dir, forceReload = false) {
        // forceReload (noCache) just clears the cache, doesn't enable env override
        logger.debug(`    loadEndpoints dir = ${dir}, forceReload = ${forceReload}`)
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

    enableEnvOverride() {
        this.useEnvOverride = true
    }

    getQueryEndpoint() {
        if (!this.endpoints) {
            logger.error('SessionEnvironment.getQueryEndpoint: No endpoints loaded')
            throw new Error('No endpoints loaded. Call loadEndpoints() first.')
        }
        const endpoint = this.endpoints.find(e => e.type === 'query')
        if (!endpoint) {
            logger.error('SessionEnvironment.getQueryEndpoint: No query endpoint found in endpoints.json')
            throw new Error('No query endpoint found in endpoints configuration')
        }
        return this.applyEnvOverrides(endpoint)
    }

    getUpdateEndpoint() {
        if (!this.endpoints) {
            logger.error('SessionEnvironment.getUpdateEndpoint: No endpoints loaded')
            throw new Error('No endpoints loaded. Call loadEndpoints() first.')
        }
        const endpoint = this.endpoints.find(e => e.type === 'update')
        if (!endpoint) {
            logger.error('SessionEnvironment.getUpdateEndpoint: No update endpoint found in endpoints.json')
            throw new Error('No update endpoint found in endpoints configuration')
        }
        return this.applyEnvOverrides(endpoint)
    }

    applyEnvOverrides(endpoint) {
        // Use endpoints.json by default, only override if explicitly enabled
        if (this.useEnvOverride) {
            // Override with environment variables - all must be set
            if (!process.env.SPARQL_HOST || !process.env.SPARQL_PORT || !process.env.SPARQL_DATASET ||
                !process.env.SPARQL_USER || !process.env.SPARQL_PASSWORD) {
                logger.error('SessionEnvironment.applyEnvOverrides: Missing required environment variables')
                logger.error('Required: SPARQL_HOST, SPARQL_PORT, SPARQL_DATASET, SPARQL_USER, SPARQL_PASSWORD')
                throw new Error('Environment variable override requested but required variables are not set')
            }
            const dataset = process.env.SPARQL_DATASET
            const endpointType = endpoint.type === 'query' ? 'query' : 'update'
            return {
                ...endpoint,
                url: `http://${process.env.SPARQL_HOST}:${process.env.SPARQL_PORT}/${dataset}/${endpointType}`,
                credentials: {
                    user: process.env.SPARQL_USER,
                    password: process.env.SPARQL_PASSWORD
                }
            }
        } else {
            // Use endpoint from endpoints.json file as-is
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