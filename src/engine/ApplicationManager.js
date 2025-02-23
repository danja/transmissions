// ApplicationManager.js
import rdf from 'rdf-ext'
import ns from '../utils/ns.js'
import path from 'path'
import fs from 'fs/promises'
import _ from 'lodash'
import logger from '../utils/Logger.js'
import RDFUtils from '../utils/RDFUtils.js'
import MockApplicationManager from '../utils/MockApplicationManager.js'
import TransmissionBuilder from './TransmissionBuilder.js'
import ModuleLoaderFactory from './ModuleLoaderFactory.js'
import AppResolver from './AppResolver.js'

class ApplicationManager {
    constructor() {
        this.appResolver = new AppResolver()
        this.moduleLoader = null
        this.dataset = rdf.dataset()
    }

    async initialize(appName, appPath, subtask, target, flags) {
        logger.debug(`ApplicationManager.initialize, appName=${appName}, appPath=${appPath}, subtask=${subtask}, target=${target}`)

        if (flags && flags.test) {
            const mock = new MockApplicationManager()
            await mock.initialize(appName, appPath, subtask, target, flags)
            return mock
        }

        await this.appResolver.initialize(appName, appPath, subtask, target)
        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(this.appResolver.getModulePath())

        const appNode = rdf.namedNode(`http://purl.org/stuff/transmissions/${appName}`)
        const sessionNode = rdf.blankNode()

        this.dataset.add(rdf.quad(
            appNode,
            ns.rdf.type,
            ns.trn.Application
        ))

        this.dataset.add(rdf.quad(
            sessionNode,
            ns.rdf.type,
            ns.trn.ApplicationSession
        ))

        this.dataset.add(rdf.quad(
            sessionNode,
            ns.trn.application,
            appNode
        ))

        logger.log(this.dataset)

        // Add to config before building transmissions
        this.appResolver.dataset = this.dataset
        this.appResolver.sessionNode = sessionNode

        return this
    }

    async buildTransmissions(transmissionConfigFile, processorsConfigFile, moduleLoader, app) {
        logger.debug(`\nApplicationManager.build ****************************************`)

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
        logger.debug(`\n||| ApplicationManager.start`)
        logger.debug(`
            transmissionsFile=${this.appResolver.getTransmissionsPath()}
            configFile=${this.appResolver.getConfigPath()}
            subtask=${this.appResolver.subtask}`)

        const transmissions = await this.buildTransmissions()

        logger.debug(`Transmissions has length ${transmissions.length}`)
        // Get application context
        const contextMessage = this.appResolver.toMessage()

        // Modify the input message in place
        _.merge(message, contextMessage)

        logger.trace('Message with merged context:', message)

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
}

export default ApplicationManager