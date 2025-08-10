import path from 'path'
import fs from 'fs/promises'
import logger from '../../utils/Logger.js'
import AppManager from '../../engine/AppManager.js'
import WebRunner from '../http/server/WebRunner.js'
import EditorWebRunner from '../http/server/EditorWebRunner.js'
import Defaults from './Defaults.js'

class CommandUtils {

    #appManager

    constructor() {
        this.#appManager = new AppManager()
    }

    async handleOptions(options) {
        this.options = options

     
        // logger.log(`options.appDir = ${options}`)

        // process.exit()

        var debugLevel = (options.verbose || options.test) ? "debug" : "info"
        if (!options.verbose) logger.silent = options.silent
        logger.setLogLevel(debugLevel)

        logger.debug('CommandUtils.handleOptions')
        logger.debug(`${this}`)

        var target = options.target

        // Resolve target path if relative
        if (target && !target.startsWith('/')) {
            target = path.join(process.cwd(), target)
        }

        logger.debug(`CommandUtils.handleOptions, pre-split, options.app = ${options.app}`)
        const { appName, appPath, subtask } = await CommandUtils.parseAppArg(options.app)

        logger.debug(`CommandUtils.handleOptions, post-split, appName = ${appName}, appPath = ${appPath}, subtask = ${subtask}`)



        // If web mode and no app specified, use web-only AppManager
        if (options.web && !appName) {
            const webOnlyAppManager = AppManager.createWebOnly()
            const webRunner = new WebRunner(webOnlyAppManager, { port: options.port })
            await webRunner.start()
            return
        }

        const appOptions = {
            appName,
            appPath,
            subtask,
            targetDir: target,
            modulePath: options.modulePath,
            dataPath: options.dataPath,
            verbose: options.verbose,
            workingDir: options.directory,
            silent: options.silent,
            test: options.test,
            web: options.web,
            port: options.port,
            message: options.message,
            classpath: options.classpath ? options.classpath.split(path.delimiter) : []
        }

        this.#appManager = await this.#appManager.initApp(appOptions)

        if (options.web) {
            const webRunner = new WebRunner(this.#appManager, { port: options.port })
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
        //  logger.log(options)
        //var debugLevel = options.verbose ? "debug" : "info"
        //if (!options.verbose) logger.silent = options.silent
        logger.setLogLevel("debug")

        logger.info('Launching Transmissions Editor...')

        // Create and start the editor web runner
        const port = options.port || 9000
        const editorWebRunner = new EditorWebRunner(port)
        await editorWebRunner.setupEditor()
        //   await editorWebRunner.start()
        // Keep the process running
        return new Promise((resolve) => {
            process.on('SIGINT', async () => {
                logger.info('Shutting down editor server...')
                await editorWebRunner.stop()
                resolve()
            })
        })
    }

    static async parseAppArg(appArg) {

        logger.debug(`CommandUtils.parseAppArg, appArg = ${appArg}`)
        
        // Handle undefined/null appArg (e.g., when using web mode without app)
        if (!appArg) {
            return { appName: null, appPath: null, subtask: null }
        }
        
        if (!path.isAbsolute(appArg)) { // is relative 
            appArg = path.join(process.cwd(), Defaults.appsDir, appArg)
        }
        logger.debug(`CommandUtils.parseAppArg appArg = ${appArg}`)

        // Handle the case where the app name doesn't include a path
        if (!appArg.includes(path.sep)) {
            // This is just an app name like "nop" without a path
            var appName = appArg
            var subtask = false

            // Check if there's a subtask specified
            if (appName.includes('.')) {
                const split = appName.split('.')
                appName = split[0]
                subtask = split[1]
            }

            const appPath = await FSUtils.findInDirectory(options.appPath, appName)

            // For simple app names, we'll resolve the path later in AppManager
            logger.debug(`Simple app name: appName:${appName}, subtask:${subtask}`)
            return { appName, appPath, subtask }
        }

        // Handle full paths
        const parts = appArg.split(path.sep)
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
            message = JSON.parse(messageString)
        } catch (err) {
            // If JSON parsing failed, try to load from file
            logger.debug(`*** Loading JSON from file : ${JSON.stringify(messageString)}`)
            try {
                const filePath = path.resolve(messageString)
                const fileContent = await fs.readFile(filePath, 'utf8')
                message.payload = JSON.parse(fileContent)
            } catch (fileErr) {
                logger.warn(`Failed to parse message as JSON or load from file: ${err.message}`)
                message = { originalString: messageString }
            }
        }
        return message
    }

    async runRepl(appArg, argv) {
        const { appName, appPath, subtask } = await CommandUtils.parseAppArg(appArg)
        const appOptions = {
            appName,
            appPath,
            subtask,
            targetDir: argv.target,
            modulePath: argv.modulePath,
            dataPath: argv.dataPath,
            verbose: argv.verbose,
            workingDir: argv.directory,
            silent: argv.silent,
            test: argv.test,
            web: false,
            port: argv.port,
            message: argv.message
        }
        const appManager = await this.#appManager.initApp(appOptions)
        return appManager
    }

    toString() {
        return `\n *** CommandUtils ***
            this =  \n     ${JSON.stringify(this).replaceAll(',', ',\n      ')}`
    }
}

export default CommandUtils