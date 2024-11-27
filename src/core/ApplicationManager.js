// src/api/ApplicationManager.js
import path from 'path'
import fs from 'fs/promises'
import _ from 'lodash'

import rdf from 'rdf-ext'
import { fromFile } from 'rdf-utils-fs'

import logger from '../utils/Logger.js'
import TransmissionBuilder from '../engine/TransmissionBuilder.js'
import ModuleLoaderFactory from '../api/ModuleLoaderFactory.js'

class ApplicationManager {
    constructor() {
        this.appsDir = 'src/applications'
        this.transmissionFilename = 'transmissions.ttl'
        this.configFilename = 'processors-config.ttl'
        this.moduleSubDir = 'processors'
        this.dataSubDir = 'data'
        this.manifestFilename = 'manifest.ttl'
    }

    async initialize(appName, appPath, subtask, target) {
        logger.setLogLevel('info')
        logger.debug(`\n\nApplicationManager.initialize appPath =  ${appPath} `)
        this.appPath = this.resolveApplicationPath(appPath) // TODO tidy with object below

        logger.debug(`\nApplicationManager.initialize this.appPath =  ${this.appPath} `)
        this.transmissionsFile = path.join(this.appPath, this.transmissionFilename)
        this.processorsConfigFile = path.join(this.appPath, this.configFilename)
        this.modulePath = path.join(this.appPath, this.moduleSubDir)

        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(this.modulePath)
        this.app = { // TODO tidy
            appName: appName,
            appPath: appPath,
            subtask: subtask,
        }
        if (target) {
            this.app.manifestFilename = path.join(target, this.manifestFilename)
            this.app.dataset = await this.loadManifest(this.app.manifestFilename)
            this.app.targetPath = target
        }
    }


    async start(message) {
        logger.setLogLevel('debug')
        logger.debug(`\nApplicationManager.start 
    transmissionsFile : ${this.transmissionsFile}, 
    processorsConfigFile : ${this.processorsConfigFile}
    subtask : ${this.app.subtask}`)

        try {
            const transmissions = await TransmissionBuilder.build(
                this.transmissionsFile,
                this.processorsConfigFile,
                this.moduleLoader
            )

            // lodash _.merge(object, [sources])
            // https://lodash.com/docs/4.17.15#merge
            message = _.merge(message, this.app)


            if (!message.rootDir) {
                message.rootDir = this.appPath
            }
            if (!message.dataDir) {
                message.dataDir = path.join(this.appPath, this.dataSubDir)
            }
            // TODO figure out when to use rootDir and when targetPath - rename to be clearer?

            for (const transmission of transmissions) {
                if (!this.app.subtask || this.app.subtask === transmission.label) {
                    await transmission.process(message)
                }
            }

            return { success: true }
        } catch (error) {
            logger.error('Error in TransmissionRunner:', error)
            throw error
        }
    }

    async loadManifest(manifestFilename) { // TODO generalise, add URLs
        logger.debug(`ApplicationManager.loadManifest, loading : ${manifestFilename}`)
        const stream = fromFile(manifestFilename)
        const dataset = await rdf.dataset().import(stream)
        return dataset
    }

    async listApplications() {
        try {
            const entries = await fs.readdir(this.appsDir, { withFileTypes: true })
            const subdirChecks = entries
                .filter(dirent => dirent.isDirectory())
                .map(async (dirent) => {
                    const subdirPath = path.join(this.appsDir, dirent.name)
                    const files = await fs.readdir(subdirPath)
                    return files.includes('about.md') ? dirent.name : null
                })

            const validApps = (await Promise.all(subdirChecks)).filter(Boolean)
            return validApps
        } catch (err) {
            logger.error('Error listing applications:', err)
            return []
        }
    }


    resolveApplicationPath(appName) {
        logger.debug(`\nApplicationManager.resolveApplicationPath, appName = ${appName}`)

        if (appName.startsWith('/')) { // it's an absolute path
            return appName
        }

        if (appName.startsWith('..')) {
            // For external paths, use absolute path resolution
            const resolved = path.resolve(process.cwd(), appName)
            logger.debug(`ApplicationManager.resolveApplicationPath, resolved = ${resolved}`)
            return resolved
        }
        logger.debug(`ApplicationManager.resolveApplicationPath, this.appsDir = ${this.appsDir}`)

        // Default local (core) path resolution
        return path.join(process.cwd(), this.appsDir, appName)
    }


}

export default ApplicationManager