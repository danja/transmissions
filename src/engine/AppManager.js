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

    async initialize(appName, appPath, subtask, targetDir, flags) {
        // logger.debug(`AppManager.initialize ${this}`)

        /* TODO reinsert
        if (flags && flags.test) {
            const mock = new MockAppManager()
            await mock.initialize(appName, appPath, subtask, targetDir, flags)
            return mock
        }
            */
        logger.log(`AppManager.initialize, 
            appName : ${appName} 
            appPath : ${appPath}
            subtask : ${subtask}
            targetBaseDir : ${targetDir}`)

        const tdName = targetDir + `/tt.ttl`
        logger.debug(`AppManager.initialize, tdName : ${tdName}`)
        //    await this.appResolver.initialize(appName, appPath, subtask, targetBaseDir)
        //   process.exit

        const ru = new RDFUtils()

        logger.log(`AppManager.initialize, tdName : ${tdName}`)
        this.app.targetDataset = await ru.readDataset(tdName)
        logger.debug(this.app.targetDataset)

        this.appResolver.appPath = appPath
        const modulePath = this.appResolver.getModulePath()
        logger.debug(`\nAppManager.initialize, modulePath : ${modulePath}`)
        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(this.appResolver.getModulePath())
        return this
    }

    async buildTransmissions(transmissionsDatasetFile, processorsConfigFile, moduleLoader, app) {
        logger.debug(`\nAppManager.build ****************************************`)

        const builder = new TransmissionBuilder(this.moduleLoader, this.appResolver)

        const ru = new RDFUtils() // TODO refactor
        const tPath = this.appResolver.getTransmissionsPath()
        logger.debug(`AppManager.buildTransmissions, tPath : ${tPath}`)
        this.app.transmissionsDataset = await ru.readDataset(tPath)
        //    const transmissionsDataset= await RDFUtils.readDataset(this.appResolver.getTransmissionsPath())
        // REFACTORHERE
        // const processorsConfig = await RDFUtils.readDataset(this.appResolver.getConfigPath())
        //  const configDataset = await this.appResolver.loadDataset('config', this.appResolver.getConfigPath())

        this.app.configDataset = await this.targetDatasets.loadDataset('config', this.appResolver.getConfigPath())
        //  const processorsConfig = configDataset.targetDataset
        // logger.log(`LOADED configDataset = ${this.app.configDataset}`)


        return await builder.buildTransmissions(this.app)
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