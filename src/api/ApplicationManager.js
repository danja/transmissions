// src/api/ApplicationManager.js
import path from 'path'
import fs from 'fs/promises'
import logger from '../utils/Logger.js'
import TransmissionBuilder from '../engine/TransmissionBuilder.js'
import ModuleLoaderFactory from '../api/ModuleLoaderFactory.js'

class ApplicationManager {
    constructor(appsDir) {
        this.appsDir = appsDir
        this.moduleLoader = null
    }

    async initialize(modulePath) {
        logger.debug(`\nTransmissionRunner.initialize, modulePath = ${modulePath}`)
        if (typeof modulePath !== 'string') {
            throw new TypeError('Module path must be a string')
        }
        //   this.moduleLoader = ModuleLoaderFactory.createModuleLoader([modulePath])
        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(modulePath)
    }

    async run(options) {
        const {
            transmissionsFile,
            processorsConfigFile,
            message = {},
            rootDir = '',
            applicationRootDir
        } = options

        logger.debug('\nTransmissionRunner.run()')
        logger.reveal(options)
        logger.debug('transmissionsFile =' + transmissionsFile)
        logger.debug('processorsConfigFile =' + processorsConfigFile)

        //  message.applicationRootDir
        try {
            if (!this.moduleLoader) {
                throw new Error('ModuleLoader not initialized. Call initialize() first.')
            }

            const transmissions = await TransmissionBuilder.build(
                transmissionsFile,
                processorsConfigFile,
                this.moduleLoader
            )

            if (!message.rootDir) {
                message.rootDir = rootDir
            }
            if (!message.applicationRootDir) {
                // logger.log('PWDDDDDDDDDDDDD ' + process.cwd())
                message.applicationRootDir = applicationRootDir
            }

            for (const transmission of transmissions) {
                if (!options.subtask || options.subtask === transmission.label) {
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
        /* const isRemote = appName.includes('/')
        if (!isRemote) {
            return appName
        }
            */

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

    async getApplicationConfig(appPath) {
        logger.debug('appPath = ' + appPath)
        //    const appPath = this.resolveApplicationPath(appName)
        return {
            transmissionsFile: path.join(appPath, 'transmissions.ttl'),
            processorsConfigFile: path.join(appPath, 'processors-config.ttl'),
            modulePath: path.join(appPath, 'processors')
        }
    }
}

export default ApplicationManager