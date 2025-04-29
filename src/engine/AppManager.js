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

class AppManager {
    constructor() {
        this.appResolver = new AppResolver()
        this.moduleLoader = null
        this.app = new Application()
    }

    async initialize(appName, appPath, subtask, targetBaseDir, flags) {
        logger.debug(`AppManager.initialize ${this}`)

        if (flags && flags.test) {
            const mock = new MockAppManager()
            await mock.initialize(appName, appPath, subtask, targetBaseDir, flags)
            return mock
        }

        await this.appResolver.initialize(appName, appPath, subtask, targetBaseDir)
        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(this.appResolver.getModulePath())

        this.app.dataset = this.appResolver.dataset

        logger.debug(this.app.dataset)
        return this
    }

    async buildTransmissions(transmissionConfigFile, processorsConfigFile, moduleLoader, app) {
        logger.debug(`\nAppManager.build ****************************************`)

        const builder = new TransmissionBuilder(this.moduleLoader, this.appResolver)

        const ru = new RDFUtils() // TODO refactor
        const transmissionConfig = await ru.readDataset(this.appResolver.getTransmissionsPath())
        //    const transmissionConfig = await RDFUtils.readDataset(this.appResolver.getTransmissionsPath())
        // REFACTORHERE
        // const processorsConfig = await RDFUtils.readDataset(this.appResolver.getConfigPath())
        const configModel = await this.appResolver.loadModel('config', this.appResolver.getConfigPath())

        //  const processorsConfig = configModel.dataset
        //    logger.log(`LOADED configModel = ${configModel}`)

        this.app.transmissionConfig = transmissionConfig
        // Merge with app dataset
        /*
            for (const quad of app.dataset) {
              transmissionConfig.add(quad)
              processorsConfig.add(quad)
            }
        */
        return await builder.buildTransmissions(this.app, transmissionConfig, configModel)
    }

    async start(message = {}) {
        logger.debug(`\n||| AppManager.start`)
        message.app = this.app
        logger.debug(`this.app = ${this.app}`)
        logger.debug(`
            transmissionsFile=${this.appResolver.getTransmissionsPath()}
            configFile=${this.appResolver.getConfigPath()}
            subtask=${this.appResolver.subtask}`)

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
            logger.debug(`transmission = \n${transmission}`)
            if (!this.appResolver.subtask || this.appResolver.subtask === transmission.label) {
                //     await transmission.process(message)
                message = await transmission.process(message)
            }
        }
        message.success = true
        //     logger.reveal(message)
        return message //{ success: true }
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
        this =  \n     ${JSON.stringify(this).replaceAll(',', ',\n      ')}`
    }
}

export default AppManager