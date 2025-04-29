import path from 'path'
import fs from 'fs/promises'
import logger from '../../utils/Logger.js'
import AppManager from '../../engine/AppManager.js'
import WebRunner from '../http/server/WebRunner.js'
import EditorWebRunner from '../http/server/EditorWebRunner.js'

class CommandUtils {

    #appManager

    constructor() {
        this.#appManager = new AppManager()
    }

    async handleOptions(options) {
        this.options = options

        var debugLevel = (options.verbose || options.test) ? "debug" : "info"
        if (!options.verbose) logger.silent = options.silent
        logger.setLogLevel(debugLevel)

        logger.debug('CommandUtils.handleOptions')
        logger.debug(`${this}`)
        // logger.reveal(options)
        //        process.exit()

        const app = options.app
        var target = options.target

        if (target && !target.startsWith('/')) {
            target = path.join(process.cwd(), target)
        }

        var { appName, appPath, subtask } = CommandUtils.splitName(app)
        //    if (target) { // TODO refactor
        //      appPath = path.join(target, appName) // target
        //    target = path.join(appPath, appName)
        // }

        logger.debug(`\n
    after split :
    appName = ${appName}
    appPath = ${appPath}
    subtask = ${subtask}
    target = ${target}`)

        this.#appManager = await this.#appManager.initialize(appName, appPath, subtask, target, options)

        if (options.web) {
            const webRunner = new WebRunner(this.#appManager, options.port)
            await webRunner.start()
            return
        }
        const message = this.parseOrLoadMessage(options.message)
        return await this.#appManager.start(message)
    }

    /**
     * Launch the visual Transmissions editor
     * This method will build the editor if needed, start a web server,
     * and open the editor in a browser.
     *
     * @param {Object} options - Configuration options
     */
    async launchEditor(options = {}) {
        var debugLevel = options.verbose ? "debug" : "info"
        if (!options.verbose) logger.silent = options.silent
        logger.setLogLevel(debugLevel)

        logger.info('Launching Transmissions Editor...')

        // Create and start the editor web runner
        const port = options.port || 9000
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

    async listApps() {
        return await this.#appManager.listApps()
    }


    static async parseOrLoadMessage(messageString) {
        logger.debug(`CommandUtils.parseOrLoadMessage(), messageString = ${messageString}`)
        let message = {}
        try {
            message.payload = JSON.parse(messageString)
        } catch (err) {
            logger.debug('*** Loading JSON from file...')
            const filePath = path.resolve(messageString)
            const fileContent = await fs.readFile(filePath, 'utf8')
            message.payload = JSON.parse(fileContent)
        }
        return message
    }

    toString() {
        return `\n *** CommandUtils ***
        this =  \n     ${JSON.stringify(this).replaceAll(',', ',\n      ')}`
    }
}

export default CommandUtils