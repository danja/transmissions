// src/api/ApplicationManager.js
import path from 'path'
import fs from 'fs/promises'
import _ from 'lodash'

import rdf from 'rdf-ext'
import { fromFile } from 'rdf-utils-fs'

import logger from '../utils/Logger.js'
import MockApplicationManager from '../utils/MockApplicationManager.js'
import TransmissionBuilder from './TransmissionBuilder.js'
import ModuleLoaderFactory from './ModuleLoaderFactory.js'

class ApplicationManager {
    constructor() {
        this.appsDir = 'src/applications'
        this.transmissionFilename = 'transmissions.ttl'
        this.configFilename = 'config.ttl'
        this.moduleSubDir = 'processors'
        this.dataSubDir = 'data'
        this.manifestFilename = 'manifest.ttl'
    }

    async initialize(appName, appPath, subtask, target, flags) {
        logger.debug(`ApplicationManager.initialize,
            appName = ${appName}
              appPath = ${appPath}
                subtask = ${subtask}
                  target = ${target}
                    flags = ${flags}
            `)
        logger.setLogLevel('debug')
        if (flags && flags.test) {
            const mock = new MockApplicationManager()
            mock.initialize(appName, appPath, subtask, target, flags)
            return mock
        }
        // logger.setLogLevel('info')
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
        logger.debug(`ApplicationManager.initialize, target = ${target}`)
        if (target) {
            this.app.manifestFilename = path.join(target, this.manifestFilename)
            this.app.dataset = await this.loadManifest(this.app.manifestFilename)
            this.app.targetPath = target
        }
        return this
    }


    async start(message) {
        //   logger.setLogLevel('info')
        logger.debug(`\nApplicationManager.start
            transmissionsFile : ${this.transmissionsFile},
         processorsConfigFile : ${this.processorsConfigFile}
                      subtask : ${this.app.subtask}`)

        logger.reveal(message)
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
        if (!this.app.targetPath && !message.targetPath) {
            message.targetPath = message.dataDir
        }
        for (const transmission of transmissions) {
            if (!this.app.subtask || this.app.subtask === transmission.label) {
                await transmission.process(message)
            }
        }

        return { success: true }
    }

    async loadManifest(manifestFilename) { // TODO generalise, add URLs
        logger.debug(`ApplicationManager.loadManifest, try loading : ${manifestFilename}`)
        try {

            const stream = fromFile(manifestFilename)
            return await rdf.dataset().import(stream)


        } catch (err) {
            logger.debug(`ApplicationManager.loadManifest, ${manifestFilename} non-existent, creating empty dataset`)
            return rdf.dataset()
        }
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