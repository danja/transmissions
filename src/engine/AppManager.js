// AppManager.js
import path from 'path'
import fs from 'fs/promises'
import logger from '../utils/Logger.js'
import FSUtils from '../utils/FSUtils.js'
import RDFUtils from '../utils/RDFUtils.js'

import App from '../model/App.js'
import MockAppManager from '../utils/MockAppManager.js'
import TransmissionBuilder from './TransmissionBuilder.js'
import ModuleLoaderFactory from './ModuleLoaderFactory.js'
import Datasets from '../model/Datasets.js'
import Defaults from '../api/common/Defaults.js'
// import { log } from 'console'

class AppManager {
    constructor() {
        this.moduleLoader = null
        this.app = null
    }


    async initApp(options) {
        logger.debug(`\nAppManager.initApp`)
        //   logger.vr(options)
        this.app = App.instance()
        // Copy options to app
        Object.assign(this.app, options) // TODO better just calculated options

        // in utils, might be needed :         // findInDirectory(dir, targetName, depth = 0) {

        this.app.path = await this.resolveAppPath(options.appName)
        // load the transmissions dataset
        const transmissionsFilename = path.join(this.app.path, Defaults.transmissionsFilename)
        await this.app.datasets.loadDataset('transmissions', transmissionsFilename)

        // load the config dataset
        const configFilename = path.join(this.app.path, Defaults.configFilename)
        await this.app.datasets.loadDataset('config', configFilename)

        if (this.app.targetDir) {
            const targetFilename = path.join(this.app.targetDir, Defaults.targetFilename)
            await this.app.datasets.loadDataset('target', this.app.targetFilename)
        }

        //logger.log(`THIS APP = ${this.app}`)
        //process.exit()

        // Initialize module loader
        await this.initModuleLoader()

        return this
    }


    async initModuleLoader() {
        logger.debug(`\nAppManager.initModuleLoader **************************************** `)
        const modulePath = await this.getModulePath()
        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(modulePath)
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

        // Modify the input message in place
        //  _.merge(message, contextMessage)
        Object.assign(message, contextMessage)
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
        // message.sessionNode = this.appResolver.sessionNode

        for (const transmission of transmissions) {
            transmission.app = this.app
            logger.debug(`transmission = \n${transmission} `)
            if (!this.app.subtask || this.app.subtask === transmission.label) {

                message = await transmission.process(message)
                //   logger.rv(message)
            }
        }
        message.success = true
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