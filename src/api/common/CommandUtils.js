import path from 'path'
import fs from 'fs/promises'
import logger from '../../utils/Logger.js'
import ApplicationManager from '../../engine/ApplicationManager.js'
import WebRunner from '../http/server/WebRunner.js'
import EditorWebRunner from '../http/server/EditorWebRunner.js'

class CommandUtils {

    #appManager

    constructor() {
        this.#appManager = new ApplicationManager()
    }

    async begin(application, target, message = {}, flags = {}) {

        var debugLevel = (flags.verbose || flags.test) ? "debug" : "info"
        if (!flags.verbose) logger.silent = flags.silent
        logger.setLogLevel(debugLevel)

        logger.debug('CommandUtils.begin')
        logger.debug('   process.cwd() = ' + process.cwd())
        logger.debug('   flags = ' + flags)

        logger.debug('   application = ' + application)
        logger.debug('   target = ' + target)
        logger.debug(`   message = ${message}`)


        if (target && !target.startsWith('/')) {
            target = path.join(process.cwd(), target)
        }

        var { appName, appPath, subtask } = CommandUtils.splitName(application)


        logger.trace(`\n
    after split :
    appName = ${appName}
    appPath = ${appPath}
    subtask = ${subtask}
    target = ${target}`)

        this.#appManager = await this.#appManager.initialize(appName, appPath, subtask, target, flags)

        if (flags.web) {
            const webRunner = new WebRunner(this.#appManager, flags.port)
            await webRunner.start()
            return
        }

        return await this.#appManager.start(message)
    }

    /**
     * Launch the visual Transmissions editor
     * This method will build the editor if needed, start a web server,
     * and open the editor in a browser.
     *
     * @param {Object} flags - Configuration flags
     */
    async launchEditor(flags = {}) {
        var debugLevel = flags.verbose ? "debug" : "info"
        if (!flags.verbose) logger.silent = flags.silent
        logger.setLogLevel(debugLevel)

        logger.info('Launching Transmissions Editor...')

        // Create and start the editor web runner
        const port = flags.port || 9000
        const editorWebRunner = new EditorWebRunner(port)
        await editorWebRunner.start()
        // Keep the process running
        return new Promise((resolve) => {
            process.on('SIGINT', async () => {
                logger.info('Shutting down editor server...')
                await editorWebRunner.stop()
                resolve()
            })
        })
    }

    static splitName(fullPath) {
        logger.debug(`CommandUtils.splitName
   fullPath  = ${fullPath}`)
        const parts = fullPath.split(path.sep)
        logger.debug(`   parts  = ${parts}`)
        var lastPart = parts[parts.length - 1]

        var subtask = false
        if (lastPart.includes('.')) {
            const split = lastPart.split('.')
            subtask = split[1]
            lastPart = split[0]
        }
        var appPath = parts.slice(0, parts.length - 1).join(path.sep)
        appPath = path.join(appPath, lastPart)



        logger.debug(`   appName:${lastPart}, appPath:${appPath}, subtask:${subtask},`)

        return { appName: lastPart, appPath: appPath, subtask: subtask }
    }

    async listApplications() {
        return await this.#appManager.listApplications()
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