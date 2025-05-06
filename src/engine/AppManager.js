// AppManager.js
import path from 'path'
import fs from 'fs/promises'
import _ from 'lodash'
import logger from '../utils/Logger.js'
import RDFUtils from '../utils/RDFUtils.js'

import Application from '../model/App.js'
import MockAppManager from '../utils/MockAppManager.js'
import TransmissionBuilder from './TransmissionBuilder.js'
import ModuleLoaderFactory from './ModuleLoaderFactory.js'
import Datasets from '../model/Datasets.js'
import Defaults from '../api/common/Defaults.js'
// import { log } from 'console'

class AppManager {
    constructor() {
        this.targetDatasets
        this.moduleLoader = null
        this.app = new Application()
    }


    async initApp(options) {
        logger.log(`\nAppManager.initApp, options = `)
        logger.vr(options)

        // Copy options to app
        Object.assign(this.app, options)

        this.app.datasets = new Datasets()

        // in utils, might be needed :         // findInDirectory(dir, targetName, depth = 0) {

        // load the transmissions dataset
        const transmissionsFilename = path.join(options.appPath, Defaults.transmissionsFilename)
        await this.app.datasets.loadDataset('transmissions', transmissionsFilename)

        // load the config dataset
        const configFilename = path.join(options.appPath, Defaults.configFilename)
        await this.app.datasets.loadDataset('transmissions', transmissionsFilename)

        if (this.app.targetDir) {
            await this.app.datasets.loadDataset('target', this.app.targetDir)
        }

        // Initialize module loader
        this.initModuleLoader()

        return this
    }


    initModuleLoader() {
        logger.debug(`\nAppManager.initModuleLoader **************************************** `)
        const modulePath = this.getModulePath()
        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(modulePath)
    }

    async buildTransmissions() {
        logger.debug(`\nAppManager.buildTransmissions **************************************** `)

        // Create a builder with our module loader and app resolver
        const builder = new TransmissionBuilder(this.moduleLoader, this.appResolver)

        /*
        // Read the transmissions dataset
        const ru = new RDFUtils() // TODO REMOVE
        const tPath = this.getTransmissionsPath()
        logger.debug(`AppManager.buildTransmissions, tPath : ${tPath} `)

        try {
            // Try to read the transmissions dataset
            this.app.transmissionsDataset = await ru.readDataset(tPath)

            // Get the config path and read the config dataset
            const configPath = this.getConfigPath()
            logger.debug(`AppManager.buildTransmissions, configPath : ${configPath} `)
            this.app.configDataset = await ru.readDataset(configPath)

            // Build the transmissions
            return await builder.buildTransmissions(this.app)
        } catch (error) {
            logger.error(`Error building transmissions: ${error.message}`)
            logger.error(`Could not read dataset from path: ${tPath}`)
            throw error
        }
            */
    }

    async start(message = {}) {
        logger.debug(`\n ||| AppManager.start`)
        message.app = this.app
        logger.debug(`this.app = ${this.app} `)


        const transmissions = await this.buildTransmissions()

        // Get application context
        const contextMessage = this.appResolver.toMessage()

        // Modify the input message in place
        _.merge(message, contextMessage)
        message.appRunStart = (new Date()).toISOString()
        logger.debug('**************** Message with merged context:', message)

        /*
        for (const transmission of transmissions) {
            if (!this.appResolver.subtask || this.appResolver.subtask === transmission.label) {
                await transmission.process(message)
            }
        }
    */
        //       message.app = this.appResolver
        message.sessionNode = this.appResolver.sessionNode

        for (const transmission of transmissions) {
            logger.debug(`transmission = \n${transmission} `)
            if (!this.appResolver.subtask || this.appResolver.subtask === transmission.label) {
                //     await transmission.process(message)
                message = await transmission.process(message)
            }
        }
        message.success = true
        //     logger.reveal(message)
        return message //{ success: true }
    }

    async resolveApplicationPath(appName) {

        logger.log(`this.appsDir = ${this.appsDir}`)

        const baseDir = this.targetDir || path.join(process.cwd(), this.appsDir)

        const appPath = await this.findInDirectory(baseDir, appName)
        logger.log(`APP PATH = ${appPath}`)
        process.exit()

        if (!appPath) {
            throw new Error(`Could not find 
                    appName : ${appName}
                    baseDir : ${baseDir}
    (check the app dir is on local path and contains at least about.md and transmissions.ttl)`)
        }

        return appPath
    }



    getConfigPath() {
        logger.debug(`\nAppManager.getConfigPath`)

        // Make sure we have a configFilename
        if (!this.app.configFilename) {
            this.app.configFilename = 'config.ttl'
        }

        return path.join(this.app.path, this.app.configFilename)
    }

    getModulePath() {
        logger.debug(`AppManager.getModulePath`)

        // Default moduleSubDir if not set
        if (!this.app.moduleSubDir) {
            this.app.moduleSubDir = 'processors'
        }

        return path.join(this.app.path, this.app.moduleSubDir)
    }

    resolveDataDir() {
        if (this.targetDir) {
            this.workingDir = this.targetDir
        }
        if (!this.workingDir) {
            this.workingDir = path.join(this.appPath, this.dataSubDir)
        }
        return this.workingDir
    }

    toMessage() {
        return {
            appName: this.app.name,
            appPath: this.app.path,
            subtask: this.app.subtask,
            rootDir: this.app.rootDir,
            workingDir: this.app.dataDir,
            targetDir: this.app.targetDir,
            dataset: this.targetDataset
        }
    }

    async listApps() {
        try {
            const entries = await fs.readdir(this.appResolver.appsDir, { withFileTypes: true })
            const subdirChecks = entries
                .filter(dirent => dirent.isDirectory())
                .map(async (dirent) => {
                    const subdirPath = path.join(this.appResolver.appsDir, dirent.name)
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

    toString() {
        return `\n *** AppManager ***
    this =  \n     ${JSON.stringify(this).replaceAll(',', ',\n      ')} `
    }
}

export default AppManager