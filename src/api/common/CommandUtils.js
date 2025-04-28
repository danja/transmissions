import path from 'path'
import fs from 'fs/promises'
import logger from '../../utils/Logger.js'
import ApplicationManager from '../../engine/ApplicationManager.js'
import WebRunner from '../http/server/WebRunner.js'
import EditorWebRunner from '../http/server/EditorWebRunner.js'

class CommandUtils {

    constructor(options) {
        this.options = options
        this.appOptions = {}
        this.appManager = new ApplicationManager()
    }

    setDebug() {
        var debugLevel = (this.options.verbose || this.options.test) ? "debug" : "info"
        if (!this.options.verbose) logger.silent = this.options.silent
        logger.setLogLevel(debugLevel)
    }

    resolveTargetPath() {
        logger.debug(`??????????   resolveTargetPath, this.options.target = ${this.options.target}`)
        this.appOptions.targetPath = this.options.target
        if (this.options.target && !this.options.target.startsWith('/')) {
            this.appOptions.targetPath = path.join(process.cwd(), this.options.target)
        }
    }



    async interpret() {
        this.setDebug()
        // application, moduleDir, target, message = {}, flags = {}
        /*
        var debugLevel = (flags.verbose || flags.test) ? "debug" : "info"
        if (!flags.verbose) logger.silent = flags.silent
        logger.setLogLevel(debugLevel)
    */
        logger.debug(`CommandUtils.begin ${this.toString()}`)

        this.resolveTargetPath()

        var split = CommandUtils.splitName(this.options.application)
        Object.assign(this.appOptions, split)
        // { appName, appPath, subtask } 
        //  this.appOptions.appName, this.appOptions.appPath, this.appOptions.subtask

        if (this.appOptions.targetPath) { // TODO refactor
            this.appOptions.appPath = path.join(this.appOptions.targetPath, this.appOptions.appName) // target
        }

        logger.debug(this)



        //    this.appManager = await this.appManager.initialize(appName, appPath, subtask, this.appOptions.targetPath, moduleDir, flags)
        this.appManager = await this.appManager.initialize(this.appOptions)

        if (this.options.web) {
            const webRunner = new WebRunner(this.appManager, this.options.port)
            await webRunner.start()
            return
        }

        return await this.appManager.start(this.options.message)
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


    toString() {
        return `\n*** CommandUtils ***
   process.cwd() = ${process.cwd()}
   this.options =  \n     ${JSON.stringify(this.options).replaceAll(',', ',\n      ')}
   this.appOptions = \n     ${JSON.stringify(this.appOptions).replaceAll(',', ',\n      ')}`
    }

}
export default CommandUtils