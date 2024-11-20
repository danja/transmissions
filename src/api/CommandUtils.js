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

    async run(application, target, message = {}) {
        logger.setLogLevel('debug')
        logger.debug('\nCommandUtils.run()')
        logger.debug('CommandUtils.run, process.cwd() = ' + process.cwd())
        logger.debug('CommandUtils.run, application = ' + application)
        logger.debug('CommandUtils.run, target = ' + target)

        // dir containing manifest
        if (target && !target.startsWith('/')) {
            target = path.join(process.cwd(), target)
        }

        const appSplit = CommandUtils.splitName(application)
        const appName = appSplit.first // short name or path (TODO or URL)
        const subtask = appSplit.second

        logger.debug('CommandUtils.run, appName = ' + appName)

        const transmissionsDir = this.appManager.resolveApplicationPath(appName)

        logger.debug('CommandUtils.run, transmissionsDir = ' + transmissionsDir)
        //   logger.debug('CommandUtils.run,  normalizedAppPath = ' + normalizedAppPath)

        const config = await this.appManager.getApplicationConfig(transmissionsDir)

        logger.debug('config.modulePath = ' + config.modulePath)
        //        this.runner = new TransmissionRunner()
        await this.runner.initialize(config.modulePath)

        const defaultDataDir = path.join(transmissionsDir, '/data')
        logger.debug('CommandUtils.run, defaultDataDir = ' + defaultDataDir)

        logger.debug('CommandUtils.run,  target = ' + target)
        logger.debug('CommandUtils.run,  application = ' + application)

        message = {
            ...message,
            dataDir: defaultDataDir,
            rootDir: target || transmissionsDir,
            applicationRootDir: transmissionsDir
        }

        return await this.runner.run({
            ...config,
            message,
            subtask
        })
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

    async listApplications() {
        return await this.appManager.listApplications()
    }

    static async parseOrLoadContext(contextArg) {
        logger.debug(`CommandUtils.parseOrLoadContext(), contextArg = ${contextArg}`)
        let message = {}
        try {
            message.payload = JSON.parse(contextArg)
        } catch (err) {
            logger.debug('*** Loading JSON from file...')
            const filePath = path.resolve(contextArg)
            const fileContent = await fs.readFile(filePath, 'utf8')
            message.payload = JSON.parse(fileContent)
        }
        return message
    }
}

export default CommandUtils
