// ApplicationManager.js
import path from 'path'
import fs from 'fs/promises'
import _ from 'lodash'
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
    }

    async initialize(appOptions) {

        Object.assign(this, appOptions)

        logger.debug(`ApplicationManager.initialize, ${this}`)


        if (appOptions.test) {
            const mock = new MockApplicationManager()
            await mock.initialize(appOptions)
            return mock
        }

        logger.debug(`ApplicationManager.initialize, this = ${this}`)
        await this.appResolver.initialize(appOptions)
        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(this.appResolver.getModulePath())
        this.app.dataset = this.appResolver.dataset

        logger.debug(`   this.app = ${this.app}`)
        return this
    }

    async buildTransmissions(transmissionConfigFile, processorsConfigFile, moduleLoader, app) {
        logger.debug(`\nApplicationManager.build **************************************** `)

        const builder = new TransmissionBuilder(this.moduleLoader, this.appResolver)

        const ru = new RDFUtils() // TODO refactor
        const transmissionConfig = await ru.readDataset(this.appResolver.getTransmissionsPath())
        //    const transmissionConfig = await RDFUtils.readDataset(this.appResolver.getTransmissionsPath())
        // REFACTORHERE
        // const processorsConfig = await RDFUtils.readDataset(this.appResolver.getConfigPath())
        const configModel = await this.appResolver.loadModel('config', this.appResolver.getConfigPath())

        //  const processorsConfig = configModel.dataset
        //    logger.log(`LOADED configModel = ${ configModel }`)

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
        logger.debug(`\n ||| ApplicationManager.start`)
        message.app = this.app
        logger.debug(`this.app = ${this.app}`)
        logger.debug(`
            transmissionsFile = ${this.appResolver.getTransmissionsPath()}
            configFile = ${this.appResolver.getConfigPath()}
            subtask = ${this.appResolver.subtask}`)

        const transmissions = await this.buildTransmissions()

        // TODO this is wrong
        logger.debug(`Transmissions has length ${transmissions.length}`)

        // Get application context
        const messageBits = this.appResolver.toMessage()
        Object.assign(message, messageBits) // insert those bits

        // Modify the input message in place
        //  _.merge(message, startMessage)


        message.appRunStart = (new Date()).toISOString()
        // message.target = this.app.target
        // HERERER
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

    toString() {
        return `\n*** ApplicationManager ***
   this =  \n     ${JSON.stringify(this).replaceAll(',', ',\n      ')}`
    }
}


export default ApplicationManager