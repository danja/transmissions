// src/cli/CommandUtils.js

import path from 'path'
import fs from 'fs/promises'
import logger from '../utils/Logger.js'

import TransmissionRunner from '../core/TransmissionRunner.js'
import ApplicationManager from '../core/ApplicationManager.js'



class CommandUtils {
    constructor(appsDir) {
        this.appManager = new ApplicationManager(appsDir)
        this.runner = new TransmissionRunner()
    }

    static splitName(fullPath) {
        const parts = fullPath.split(path.sep)
        const lastPart = parts[parts.length - 1]
        if (lastPart.includes('.')) {
            const [name, task] = lastPart.split('.')
            return { first: name, second: task }
        }
        return { first: lastPart, second: false }
    }

    async run(application, target, message = {}) {
        logger.setLogLevel('debug')
        logger.debug('\nCommandUtils.run()')

        const normalizedAppPath = path.normalize(application)
        const isRemoteModule = normalizedAppPath.startsWith('..')

        const appSplit = CommandUtils.splitName(normalizedAppPath)
        const appName = appSplit.first
        const subtask = appSplit.second

        const transmissionsDir = isRemoteModule
            ? normalizedAppPath
            : this.appManager.resolveApplicationPath(appName)

        const config = await this.appManager.getApplicationConfig(appName)

        await this.runner.initialize(config.modulePath)

        const defaultDataDir = path.join(transmissionsDir, '/data')
        message = {
            ...message,
            dataDir: defaultDataDir,
            rootDir: target || application,
            applicationRootDir: target || application
        }

        return await this.runner.run({
            ...config,
            message,
            subtask
        })
    }

    async listApplications() {
        return await this.appManager.listApplications()
    }

    static async parseOrLoadContext(contextArg) {
        let message = ''
        try {
            message = JSON.parse(contextArg)
        } catch (err) {
            logger.log(err)
            const filePath = path.resolve(contextArg)
            const fileContent = await fs.readFile(filePath, 'utf8')
            message = JSON.parse(fileContent)
        }
        return message
    }
}

export default CommandUtils
