// src/api/CommandUtils.js

import path from 'path'
import fs from 'fs/promises'
import logger from '../utils/Logger.js'

import TransmissionRunner from '../engine/TransmissionRunner.js'
import ApplicationManager from './ApplicationManager.js'

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
        logger.debug('CommandUtils.run, process.cwd() = ' + process.cwd())
        logger.debug('CommandUtils.run, application = ' + application)
        logger.debug('CommandUtils.run, target = ' + target)

        const normalizedAppPath = path.normalize(application) // needed?
        logger.debug('CommandUtils.run, normalizedAppPath = ' + normalizedAppPath)

        const isRemoteModule = normalizedAppPath.includes('/')
        //normalizedAppPath.startsWith('..') // no!

        const appSplit = CommandUtils.splitName(normalizedAppPath)
        const appName = appSplit.first
        const subtask = appSplit.second

        const transmissionsDir = isRemoteModule
            ? normalizedAppPath
            : this.appManager.resolveApplicationPath(appName)

        logger.debug('CommandUtils.run, transmissionsDir = ' + transmissionsDir)
        const appPath = path.join(transmissionsDir, appName)

        logger.debug('CommandUtils.run,  normalizedAppPath = ' + normalizedAppPath)

        //const config = await this.appManager.getApplicationConfig(appName)
        // const config = await this.appManager.getApplicationConfig(appPath)
        const config = await this.appManager.getApplicationConfig(transmissionsDir)

        logger.debug('config.modulePath = ' + config.modulePath)
        //        this.runner = new TransmissionRunner()
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
