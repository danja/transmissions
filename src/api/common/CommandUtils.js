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

        var app = options.app
        var target = options.target

        // Resolve target path if it's relative
        if (target && !target.startsWith('/')) {
            target = path.join(process.cwd(), target)
        }

        // Resolve app path if it's not absolute or relative
        if (app && !app.startsWith('/') && !app.startsWith('.')) {
            app = path.join(process.cwd(), app)
        }
        
        logger.debug(`CommandUtils.handleOptions, pre-split, app = ${app}`)
        var { appName, appPath, subtask } = CommandUtils.splitName(app)

        logger.debug(`\n
    after split :
    appName = ${appName}
    appPath = ${appPath}
    subtask = ${subtask}
    target = ${target}`)

        const appOptions = {
            appName: appName,
            appPath: appPath,
            subtask: subtask,
            targetDir: target,  // Changed from targetBaseDir to targetDir to match variable used in AppManager
            modulePath: options.modulePath,
            dataPath: options.dataPath,
            verbose: options.verbose,
            silent: options.silent,
            test: options.test,
            web: options.web,
            port: options.port,
            message: options.message
        }



        this.#appManager = await this.#appManager.initialize(appOptions)

        if (options.web) {
            const webRunner = new WebRunner(this.#appManager, options.port)
            await webRunner.start()
            return
        }
        const message = await CommandUtils.parseOrLoadMessage(options.message)
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
        logger.debug(`CommandUtils.splitName fullPath = ${fullPath}`)
        
        // Handle the case where the app name doesn't include a path
        if (!fullPath.includes(path.sep)) {
            // This is just an app name like "nop" without a path
            var appName = fullPath
            var subtask = false
            
            // Check if there's a subtask specified
            if (appName.includes('.')) {
                const split = appName.split('.')
                subtask = split[1]
                appName = split[0]
            }
            
            // For simple app names, we'll resolve the path later in AppManager
            logger.debug(`Simple app name: appName:${appName}, subtask:${subtask}`)
            return { appName, appPath: null, subtask }
        }
        
        // Handle full paths
        const parts = fullPath.split(path.sep)
        logger.debug(`Path parts: ${parts}`)
        var lastPart = parts[parts.length - 1]

        var subtask = false
        if (lastPart.includes('.')) {
            const split = lastPart.split('.')
            subtask = split[1]
            lastPart = split[0]
        }
        
        // Build the app path
        var appPath = parts.slice(0, parts.length - 1).join(path.sep)
        appPath = path.join(appPath, lastPart)

        logger.debug(`Full path: appName:${lastPart}, appPath:${appPath}, subtask:${subtask}`)
        return { appName: lastPart, appPath: appPath, subtask: subtask }
    }

    async listApps() {
        return await this.#appManager.listApps()
    }


    static async parseOrLoadMessage(messageString) {
        if (!messageString) return {}
        logger.debug(`CommandUtils.parseOrLoadMessage(), messageString = ${messageString}`)
        let message = {}
        try {
            message = JSON.parse(JSON.stringify(messageString)) // TODO wot?
        } catch (err) {
            logger.debug(`*** Loading JSON from file : ${JSON.stringify(messageString)}`)
            process.exit()
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