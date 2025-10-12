// src/engine/AppManager.js
import path from 'path'
import * as fs from 'node:fs/promises'
import { statSync } from 'node:fs'
import logger from '../utils/Logger.js'
import FSUtils from '../utils/FSUtils.js'
import Config from './Config.js'

import App from '../model/App.js'
import TransmissionBuilder from './TransmissionBuilder.js'
import ModuleLoaderFactory from './ModuleLoaderFactory.js'
import WorkerPool from './WorkerPool.js'
import Defaults from '../api/common/Defaults.js'
// import { log } from 'console'

class AppManager {
    constructor() {
        // Load configuration from Config singleton
        this.config = Config.getInstance();
        this.moduleLoader = null
        this.app = null
        this.targetDir = null; // Initialize targetDir
        this.appResolver = { appsDir: '' }; // Initialize appResolver
        this.previousMessage = null
    }

    static simpleApp(configOverrides) {
        logger.debug(`\nAppManager.simpleApp`)
        const app = App.instance()
        app.simple = true

        // Merge overrides with configuration
        const configInstance = Config.getInstance();
        if (!configInstance) {
            throw new Error('Failed to load configuration.');
        }
        // Ensure settings is always an object
        const settings = configInstance.settings || {}; // Fallback to empty object if settings is undefined
        const appConfig = { ...settings, ...configOverrides };

        // Ensure app is not null before accessing its properties
        if (!app) {
            throw new Error('App instance is null.');
        }

        if (appConfig.workingDir) {
            app.workingDir = path.join(process.cwd(), appConfig.workingDir);
        } else {
            app.workingDir = path.join(process.cwd(), Defaults.workingDir);
        }

        return app
    }

    static createWebOnly() {
        logger.debug(`\nAppManager.createWebOnly`)
        const appManager = new AppManager()
        
        // Set up basic configuration for web-only mode
        appManager.appResolver.appsDir = path.join(process.cwd(), Defaults.appsDir)
        
        return appManager
    }

    async initApp(options) {
        logger.debug(`\nAppManager.initApp`)
        //   logger.vr(options)
        this.app = App.instance()
        // Copy options to app
        Object.assign(this.app, options) // TODO better just calculated options

        const resolvedAppPath = await this.resolveAppPath(options.appName, options.appPath)
        this.app.path = resolvedAppPath
        this.app.appPath = resolvedAppPath
        if (!this.app.rootDir) {
            this.app.rootDir = resolvedAppPath
        }

        // load the transmissions dataset
        const transmissionsFilename = path.join(this.app.path, Defaults.transmissionsFilename)
        await this.app.datasets.loadDataset('transmissions', transmissionsFilename)

        // load the config dataset
        const configFilename = path.join(this.app.path, Defaults.configFilename)
        await this.app.datasets.loadDataset('config', configFilename)

        if (this.app.targetDir) {
            this.app.workingDir = this.app.targetDir
            const targetFilename = path.join(this.app.targetDir, Defaults.targetFilename)
            await this.app.datasets.loadDataset('target', targetFilename)
        }

        if (!this.app.workingDir) {
            this.app.workingDir = path.join(this.app.path, Defaults.workingDir)
        }

        await this.initModuleLoader()
        await this.initWorkerPool()

        // logger.debug(`this.app = ${this.app}`)
        return this
    }


    async initModuleLoader() {
        logger.debug(`\nAppManager.initModuleLoader **************************************** `)
        const modulePath = this.getModulePath()
        logger.log(`*** Module path = ${modulePath}`)
        
        // Create the module loader using the factory
        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(modulePath)
    }

    async initWorkerPool() {
        logger.debug(`\nAppManager.initWorkerPool`)

        // Check environment variables for worker configuration
        const useWorkers = process.env.TRANSMISSIONS_USE_WORKERS === 'true'
        const workerModule = process.env.TRANSMISSIONS_WORKER_MODULE
        const workerPoolSize = parseInt(process.env.TRANSMISSIONS_WORKER_POOL_SIZE || '2', 10)

        if (useWorkers && workerModule) {
            try {
                // Resolve worker module path relative to project root
                const workerModulePath = path.resolve(workerModule)
                logger.debug(`Creating WorkerPool with module: ${workerModulePath}, size: ${workerPoolSize}`)
                this.app.workerPool = new WorkerPool(workerModulePath, workerPoolSize)
                logger.info(`WorkerPool initialized with ${workerPoolSize} workers using module: ${workerModulePath}`)
            } catch (error) {
                logger.warn(`Failed to initialize WorkerPool: ${error instanceof Error ? error.message : 'Unknown error'}`)
                logger.debug('Continuing without worker pool - will use sequential processing')
            }
        } else {
            logger.debug('WorkerPool not configured - using sequential processing')
        }
    }


    async start(message = {}) {
        logger.debug(`\n ||| AppManager.start`)

        // Handle dynamic app loading for web-only mode
        if (!this.app && message.application) {
            logger.debug(`Dynamic loading of app: ${message.application}`)
            const appOptions = {
                appName: message.application,
                appPath: null,
                subtask: null,
                targetDir: null,
                modulePath: null,
                dataPath: null,
                verbose: false,
                workingDir: null,
                silent: false,
                test: false,
                web: true,
                port: null,
                message: null,
                classpath: []
            }
            await this.initApp(appOptions)
        }

        if (!this.app) {
            throw new Error('No application loaded. Specify app name in request.')
        }

        // TODO the meta of App needs copying
        // message.app = this.app 

        //  logger.debug(`this.app = ${this.app} `)

        const builder = new TransmissionBuilder(this.app, this.moduleLoader)
        const transmissions = await builder.buildTransmissions()

        // Store transmissions on app for processor access
        this.app.transmissions = transmissions

        //   logger.rv(transmissions)
        // process.exit()
        // Get application context

        const contextMessage = this.toMessage()
        // merge
        Object.assign(message, contextMessage)

        //   if (!message.targetDir) { // TODO move
        //     message.targetDir = this.app.workingDir
        //}
        message.appRunStart = (new Date()).toISOString()

        // Check if any entry transmissions exist (backward compatibility)
        const hasEntryTransmissions = transmissions.some(t => t.isMainTransmission)

        // logger.debug(`BEFORE = ${message}`)
        var result = null
        //    for (const transmission of transmissions) {
        for (var i = 0; i < transmissions.length; i++) {
            const transmission = transmissions[i]
            transmission.app = this.app
            //   logger.debug(`transmission = \n${transmission} `)

            // Determine if transmission should run
            let shouldRun
            if (this.app.subtask) {
                // If specific subtask requested, only run that one
                shouldRun = this.app.subtask === transmission.label
            } else if (hasEntryTransmissions) {
                // If entry transmissions exist, only run those
                shouldRun = transmission.isMainTransmission
            } else {
                // Backward compatibility: no entry transmissions, run all (original behavior)
                shouldRun = true
            }

            if (shouldRun) {
                result = await transmission.process(message)
                // Update message for next transmission with the processed result
                if (result) {
                    message = result
                }
            }
        }

        message.success = true
        // logger.debug(`AFTER = ${JSON.stringify(message)}`)
        // logger.v(message)

        // Clean up worker pool if it exists
        if (this.app.workerPool) {
            logger.debug('Terminating worker pool...')
            this.app.workerPool.terminate()
        }

        // Get the final output from the last processor if available
        /*
        const lastTransmission = transmissions[transmissions.length - 1]
        if (lastTransmission && lastTransmission.processor) {
            const outputs = lastTransmission.processor.getOutputs()
            if (outputs && outputs.length > 0) {
                message.processorOutputs = outputs
            }
        }*/
        //  logger.debug(`FINAL = ${JSON.stringify(message)}`)
        return message
    }

    async resolveAppPath(appName, explicitPath) {
        if (explicitPath) {
            const candidatePath = path.resolve(explicitPath)
            const defaultAppPath = path.join(process.cwd(), Defaults.appsDir, appName || '')

            try {
                const stats = await fs.stat(candidatePath)
                if (stats.isDirectory()) {
                    logger.log(`APP PATH = ${candidatePath}`)
                    return candidatePath
                }
                throw new Error(`Application path must be a directory: ${candidatePath}`)
            } catch (error) {
                const isDefaultPath = path.normalize(candidatePath) === path.normalize(defaultAppPath)
                if (!error || error.code !== 'ENOENT' || !isDefaultPath) {
                    throw error
                }
                logger.debug(`AppManager.resolveAppPath fallback search for ${appName} (explicit path not found: ${candidatePath})`)
            }
        }

        if (!appName) {
            throw new Error('Application name is required when no app path is provided')
        }

        const baseDir = this.targetDir || path.join(process.cwd(), Defaults.appsDir)
        logger.debug(baseDir)

        const appPath = await FSUtils.findSubdir(baseDir, appName)
        logger.log(`APP PATH = ${appPath}`)


        if (!appPath) {
            throw new Error(`Could not find 
                    appName : ${appName}
                    baseDir : ${baseDir}
            (check the app dir is on local path and contains at least about.md and transmissions.ttl)`)
        }

        return appPath
    }

    async listApps() {
        const appsDir = this.appResolver.appsDir || path.join(process.cwd(), Defaults.appsDir)
        // try {
        const entries = await fs.readdir(appsDir, { withFileTypes: true })
        const subdirChecks = entries
            .filter(dirent => dirent.isDirectory())
            .map(async (dirent) => {
                const subdirPath = path.join(appsDir, dirent.name)
                const files = await fs.readdir(subdirPath)
                return files.includes('about.md') ? dirent.name : null
            })

        const validApps = (await Promise.all(subdirChecks)).filter(Boolean)
        return validApps
        //     } catch (err) {
        //      logger.error('Error listing applications:', err)
        //    return []
        // }
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
        //   logger.vr(this.app)
        const appProcessorsPath = path.join(this.app.path, this.app.moduleSubDir)
        logger.debug(`AppManager.getModulePath candidate: ${appProcessorsPath}`)
        // Check if app-specific processors directory exists, if not just return app path
        try {
            statSync(appProcessorsPath)
            logger.debug(`AppManager.getModulePath using app processors dir`)
            return appProcessorsPath
        } catch (e) {
            logger.debug(`AppManager.getModulePath fallback to app root: ${this.app.path} (${e?.message})`)
            // No app-specific processors, return app path for factory to handle
            return this.app.path
        }
    }

    resolveWorkingDir() { // HERE MAYBE 
        if (this.targetDir) {
            this.workingDir = this.targetDir
        }
        if (!this.workingDir) { // ?????????????
            this.workingDir = path.join(this.app.path, this.dataDir)
        }
        return this.workingDir
    }

    toMessage() {
        return {
            appName: this.app.name,
            appPath: this.app.path,
            subtask: this.app.subtask,
            rootDir: this.app.rootDir,
            dataDir: this.app.dataDir,
            workingDir: this.app.workingDir,
            targetDir: this.app.targetDir,
            dataset: this.targetDataset
        }
    }
}

export default AppManager
