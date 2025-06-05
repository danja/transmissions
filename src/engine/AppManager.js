// AppManager.js
import path from 'path'
import * as fs from 'node:fs/promises'
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

    async initApp(options) {
        logger.debug(`\nAppManager.initApp`)
        //   logger.vr(options)
        this.app = App.instance()
        // Copy options to app
        Object.assign(this.app, options) // TODO better just calculated options

        // starting point
        this.app.path = await this.resolveAppPath(options.appName)

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

        logger.debug(`this.app = ${this.app}`)
        return this
    }


    async initModuleLoader() {
        logger.debug(`\nAppManager.initModuleLoader **************************************** `)
        const modulePath = await this.getModulePath()
        // Add any additional logic here
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

        // TODO the meta of App needs copying
        // message.app = this.app 

        logger.debug(`this.app = ${this.app} `)

        const builder = new TransmissionBuilder(this.app, this.moduleLoader)
        const transmissions = await builder.buildTransmissions()

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


        for (const transmission of transmissions) {
            transmission.app = this.app
            //   logger.debug(`transmission = \n${transmission} `)
            if (!this.app.subtask || this.app.subtask === transmission.label) {

                message = await transmission.process(message)
                //   logger.rv(message)
            }
        }
        message.success = true

        // Clean up worker pool if it exists
        if (this.app.workerPool) {
            logger.debug('Terminating worker pool...')
            this.app.workerPool.terminate()
        }

        // logger.reveal(message)
        return message //{ success: true }
    }

    async resolveAppPath(appName) {
        const baseDir = this.targetDir || path.join(process.cwd(), Defaults.appsDir)
        logger.debug(baseDir)

        const appPath = await FSUtils.findSubdir(baseDir, appName)
        // logger.log(`APP PATH = ${ appPath }`)


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
        return path.join(this.app.path, this.app.moduleSubDir)
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