// src/api/CommandUtils.js

import path from 'path'
import fs from 'fs/promises'
import logger from '../../utils/Logger.js'

import ApplicationManager from '../../core/ApplicationManager.js'

class CommandUtils {
    constructor() {
        // this.applicationLocator = applicationLocator
    }

    async begin(application, target, message = {}) {
        logger.setLogLevel('debug')
        logger.debug('\nCommandUtils.run()')
        logger.debug('CommandUtils.run, process.cwd() = ' + process.cwd())
        logger.debug('CommandUtils.run, application = ' + application)
        logger.debug('CommandUtils.run, target = ' + target)

        // dir containing manifest
        if (target && !target.startsWith('/')) {
            target = path.join(process.cwd(), target)
        }

        var { appName, appPath, subtask } = CommandUtils.splitName(application)
        // short name or path (TODO or URL)

        logger.debug(`\n
    CommandUtils.run, 
    appName = ${appName}
    appPath = ${appPath}
    subtask = ${subtask}
    target = ${target}`)


        const appManager = new ApplicationManager()
        await appManager.initialize(appName, appPath, subtask, target)

        return await appManager.start(message)
    }

    static splitName(fullPath) {
        logger.debug(`\nCommandUtils.splitName, fullPath  = ${fullPath}`)
        const parts = fullPath.split(path.sep)
        logger.debug(`\nCommandUtils.splitName, parts  = ${parts}`)
        var lastPart = parts[parts.length - 1]

        var task = false
        if (lastPart.includes('.')) {
            const split = lastPart.split('.')
            task = split[1]
            lastPart = split[0]
        }
        var appPath = parts.slice(0, parts.length - 1).join(path.sep)
        appPath = path.join(appPath, lastPart)
        //  logger.debug(`\nCommandUtils.splitName, parts.slice(0, parts.length - 1) = ${parts.slice(0, parts.length - 1)}`)

        // const appPath = parts.join(path.sep)
        logger.debug(`CommandUtils.splitName, appName:${lastPart}, appPath:${appPath}, task:${task},`)

        return { appName: lastPart, appPath: appPath, task: task }
    }

    async listApplications() {
        return await this.appManager.listApplications()
    }

    static async parseOrLoadContext(contextArg) { // TODO rename context -> message
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
