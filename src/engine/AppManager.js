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
import AppResolver from './AppResolver.js'
import Datasets from '../model/Datasets.js'
import { log } from 'console'

class AppManager {
    constructor() {
        this.targetDatasets = new Datasets()
        this.appResolver = new AppResolver()
        this.moduleLoader = null
        this.app = new Application()
    }

    //  this.#appManager = await this.#appManager.initialize(appName, appPath, subtask, target, options)
    async initialize(options) {
        logger.log(`\nAppManager.initialize, options = `)
        logger.vr(options)
        
        // Copy options to app
        Object.assign(this.app, options)
        
        // Initialize appResolver with the same options
        this.appResolver = new AppResolver(options)
        
        // Set necessary defaults if not provided
        if (!this.app.path && this.app.appName) {
            // Try to resolve from src/applications/test directory
            this.app.path = path.join(process.cwd(), 'src', 'applications', 'test', this.app.appName);
            logger.debug(`Resolved app path to: ${this.app.path}`);
        }
        
        // Set default filenames
        this.app.transmissionFilename = 'transmissions.ttl';
        this.app.configFilename = 'config.ttl';
        this.app.moduleSubDir = 'processors';
        
        // Initialize datasets if target directory provided
        if (this.app.targetDir) {
            this.initTargetDataset(this.app.targetDir)
        }
        
        // Initialize module loader
        this.initModuleLoader()
        
        return this
    }


    async initTargetDataset(targetDir) {
        const tdName = path.join(targetDir, 'tt.ttl')
        logger.debug(`AppManager.initTargetDataset, tdName : ${tdName} `)
        
        try {
            const ru = new RDFUtils()
            this.app.targetDataset = await ru.readDataset(tdName)
            logger.debug(`Target dataset loaded successfully from ${tdName}`)
        } catch (error) {
            logger.warn(`Could not load target dataset from ${tdName}: ${error.message}`)
            // Create an empty dataset instead of failing
            this.app.targetDataset = RDFUtils.createEmptyDataset()
        }
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

        // Read the transmissions dataset
        const ru = new RDFUtils()
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

        const baseDir = this.targetBaseDir || path.join(process.cwd(), this.appsDir)

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

    getTransmissionsPath() {
        logger.debug(`\nAppManager.getTransmissionsPath`)

        logger.v(this.app)

        // Create a default path based on appName
        if (!this.app.path) {
            // Try to resolve from src/applications
            const appPath = path.join(process.cwd(), 'src', 'applications', 'test', this.app.appName);
            this.app.path = appPath;
            logger.debug(`Resolved app path to: ${appPath}`);
        }

        // We need both transmissionFilename and a path to work with
        if (!this.app.transmissionFilename) {
            this.app.transmissionFilename = 'transmissions.ttl';
        }

        return path.join(this.app.path, this.app.transmissionFilename);
    }

    getConfigPath() {
        logger.debug(`\nAppManager.getConfigPath`)
        
        // Make sure we have a configFilename
        if (!this.app.configFilename) {
            this.app.configFilename = 'config.ttl';
        }
        
        return path.join(this.app.path, this.app.configFilename);
    }

    getModulePath() {
        logger.debug(`AppManager.getModulePath`)
        
        // Default moduleSubDir if not set
        if (!this.app.moduleSubDir) {
            this.app.moduleSubDir = 'processors';
        }
        
        return path.join(this.app.path, this.app.moduleSubDir);
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