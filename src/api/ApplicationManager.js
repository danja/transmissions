// src/api/ApplicationManager.js
import path from 'path'
import fs from 'fs/promises'
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
    }

    async initialize(appPath) {
        logger.setLogLevel('info')
        logger.debug(`\n\nApplicationManager.initialize appPath =  ${appPath} `)
        this.appPath = this.resolveApplicationPath(appPath)

        logger.debug(`\nApplicationManager.initialize this.appPath =  ${this.appPath} `)
        this.transmissionsFile = path.join(this.appPath, this.transmissionFilename)
        this.processorsConfigFile = path.join(this.appPath, this.configFilename)
        this.modulePath = path.join(this.appPath, this.moduleSubDir)

        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(this.modulePath)
    }

    async start(subtask, message) {
        logger.setLogLevel('debug')
        logger.debug(`\nApplicationManager.start 
    transmissionsFile : ${this.transmissionsFile}, 
    processorsConfigFile : ${this.processorsConfigFile}
    subtask : ${subtask}`)

        try {
            const transmissions = await TransmissionBuilder.build(
                this.transmissionsFile,
                this.processorsConfigFile,
                this.moduleLoader
            )


            if (!message.rootDir) {
                message.rootDir = this.appPath
            }
            if (!message.dataDir) {
                message.dataDir = path.join(this.appPath, this.dataSubDir)
            }

            /*
            if (!message.applicationRootDir) {
                message.applicationRootDir = this.applicationRootDir
            }
                */

            for (const transmission of transmissions) {
                if (!subtask || subtask === transmission.label) {
                    await transmission.process(message)
                }
            }

            return { success: true }
        } catch (error) {
            logger.error('Error in TransmissionRunner:', error)
            throw error
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