import path from 'path'
import fs from 'fs/promises'
import _ from 'lodash'

import logger from '../utils/Logger.js'
import MockApplicationManager from '../utils/MockApplicationManager.js'
import TransmissionBuilder from './TransmissionBuilder.js'
import ModuleLoaderFactory from './ModuleLoaderFactory.js'
import Application from '../model/Application.js'

class ApplicationManager {
    constructor() {
        this.app = new Application()
        this.moduleLoader = null
    }

    async initialize(appName, appPath, subtask, target, flags) {
        logger.debug(`ApplicationManager.initialize, appName=${appName}, appPath=${appPath}, subtask=${subtask}, target=${target}`)

        if (flags && flags.test) {
            const mock = new MockApplicationManager()
            await mock.initialize(appName, appPath, subtask, target, flags)
            return mock
        }

        await this.app.initialize(appName, appPath, subtask, target)
        this.moduleLoader = ModuleLoaderFactory.createApplicationLoader(this.app.getModulePath())

        return this
    }

    async start(message = {}) {
        logger.debug(`ApplicationManager.start, transmissionsFile=${this.app.getTransmissionsPath()}, configFile=${this.app.getConfigPath()}, subtask=${this.app.subtask}`)

        const transmissions = await TransmissionBuilder.build(
            this.app.getTransmissionsPath(),
            this.app.getConfigPath(),
            this.moduleLoader
        )

        // Merge application context into message
        message = _.merge({}, message, this.app.toMessage())

        // Process each transmission
        for (const transmission of transmissions) {
            if (!this.app.subtask || this.app.subtask === transmission.label) {
                await transmission.process(message)
            }
        }

        return { success: true }
    }

    async listApplications() {
        try {
            const entries = await fs.readdir(this.app.appsDir, { withFileTypes: true })
            const subdirChecks = entries
                .filter(dirent => dirent.isDirectory())
                .map(async (dirent) => {
                    const subdirPath = path.join(this.app.appsDir, dirent.name)
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