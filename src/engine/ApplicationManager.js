// ApplicationManager.js
import path from 'path'
import fs from 'fs/promises'
import _ from 'lodash'
// import rdf from 'rdf-ext'

// import ns from '../utils/ns.js'
import logger from '../utils/Logger.js'
import RDFUtils from '../utils/RDFUtils.js'

import Application from '../model/Application.js'
import MockApplicationManager from '../utils/MockApplicationManager.js'
import TransmissionBuilder from './TransmissionBuilder.js'
import ModuleLoaderFactory from './ModuleLoaderFactory.js'
import AppResolver from './AppResolver.js'

class ApplicationManager {
    constructor() {
        this.appResolver = new AppResolver()
        this.moduleLoader = null
        this.app = new Application()
        //   this.dataset = rdf.dataset()
    }

    async initialize(appName, appPath, subtask, target, flags) {
        logger.trace(`ApplicationManager.initialize, appName=${appName}, appPath=${appPath}, subtask=${subtask}, target=${target}`)

        if (flags && flags.test) {
            const mock = new MockApplicationManager()
            await mock.initialize(appName, appPath, subtask, target, flags)
            return mock
        }

        await this.appResolver.initialize(appName, appPath, subtask, target)
        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(this.appResolver.getModulePath())

        // TODO refactor more
        // Add to config before building transmissions
        await this.app.initDataset(appName)
        //    logger.log(`this.appResolver.dataset = ${this.appResolver.dataset}`)
        //  logger.log(`this.app.dataset = ${this.app.dataset}`)

        //     await this.app.mergeIn(this.appResolver.dataset)
        this.app.dataset = this.appResolver.dataset
        //   logger.log(`TYPEOF this.app.dataset = ${typeof this.app.dataset}`)
        //  logger.reveal(this.app.dataset)
        return this
    }

    async buildTransmissions(transmissionConfigFile, processorsConfigFile, moduleLoader, app) {
        logger.trace(`\nApplicationManager.build ****************************************`)

        const builder = new TransmissionBuilder(this.moduleLoader, this.appResolver)
        const transmissionConfig = await RDFUtils.readDataset(this.appResolver.getTransmissionsPath())
        const processorsConfig = await RDFUtils.readDataset(this.appResolver.getConfigPath())


        // Merge with app dataset
        /*
            for (const quad of app.dataset) {
              transmissionConfig.add(quad)
              processorsConfig.add(quad)
            }
        */
        return await builder.buildTransmissions(transmissionConfig, processorsConfig)
    }

    async start(message = {}) {
        logger.trace(`\n||| ApplicationManager.start`)
        message.app = this.app

        logger.debug(`
            transmissionsFile=${this.appResolver.getTransmissionsPath()}
            configFile=${this.appResolver.getConfigPath()}
            subtask=${this.appResolver.subtask}`)

        const transmissions = await this.buildTransmissions()

        // TODO this is wrong
        logger.debug(`Transmissions has length ${transmissions.length}`)

        // Get application context
        const contextMessage = this.appResolver.toMessage()

        // Modify the input message in place
        _.merge(message, contextMessage)
        message.appRunStart = (new Date()).toISOString()
        logger.trace('**************** Message with merged context:', message)

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
            logger.trace(`transmission = \n${transmission}`)
            if (!this.appResolver.subtask || this.appResolver.subtask === transmission.label) {
                //     await transmission.process(message)
                message = await transmission.process(message)
            }
        }
        message.success = true
        //     logger.reveal(message)
        return message //{ success: true }
    }

    async listApplications() {
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
}

export default ApplicationManager