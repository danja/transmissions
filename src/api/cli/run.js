import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import CommandUtils from '../common/CommandUtils.js'
import WebRunner from '../http/server/WebRunner.js'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { REPL } from '../repl/REPL.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../../package.json')))
const buildInfo = process.env.BUILD_INFO || 'dev'
const version = `${packageJson.version} (${buildInfo})`


const banner = ` _____                              _            _
|_   _|--------------------------> (_) -------> (_) ---------->
  | |_ __ __ _ _ __  ___ _ __ ___  _ ___ ___ _  ___  _ __  ___
  | | '__/ _\` | '_ \\/ __| '_ \` _ \\| / __/ __| |/ _ \\| '_ \\/ __)
  | | | | (_| | | | \\__ \\ | | | | | \\__ \\__ \\ | (_) | | | \\__ \\
  \\_|_|  \\__,_|_| |_|___|_| |_| |_|_|___|___|_|\\___/|_| |_|___/
   ${version.padStart(10).padEnd(20)}                             ${new Date().toISOString().split('T')[0]}
`

async function main() {
    const commandUtils = new CommandUtils()

    console.log(chalk.magentaBright(banner))
    //  console.log(chalk.cyan('Usage:'))
    // console.log(chalk.cyanBright('./trans\n'))
    const usageString = `${chalk.cyanBright('./trans [app][.subtask] [options] [target]')}}`

    const yargsInstance = yargs(hideBin(process.argv))
        .usage(usageString)
        .option('verbose', {
            alias: 'v',
            describe: chalk.yellow('Enable verbose output'),
            type: 'boolean'
        })
        .option('silent', {
            alias: 's',
            describe: chalk.yellow('Suppress all output'),
            type: 'boolean'
        })
        .option('directory', {
            alias: 'd',
            describe: chalk.yellow('Working directory for file operations'),
            type: 'string'
        })
        .option('message', {
            alias: 'm',
            describe: chalk.yellow('Input message as JSON'),
            type: 'string',
            coerce: JSON.parse
        })
        .option('classpath', {
            alias: 'cp',
            describe: chalk.yellow('Additional processor dir'),
            type: 'string'
        })
        .option('appDir', {
            alias: 'a',
            describe: chalk.yellow('App'),
            type: 'string'
        })
        .option('test', {
            alias: 't',
            describe: chalk.yellow('Run in test mode'),
            type: 'boolean',
            default: false
        })
        .option('web', {
            alias: 'w',
            describe: chalk.yellow('Start web interface'),
            type: 'boolean'
        })
        .option('port', {
            alias: 'p',
            describe: chalk.yellow('Port for web interface'),
            type: 'number',
            default: 4500
        })
        .option('editor', {
            alias: 'e',
            describe: chalk.yellow('Launch the visual Transmissions editor'),
            type: 'boolean'
        })
        .option('repl', {
            alias: 'r',
            describe: chalk.yellow('Run in REPL mode'),
            type: 'boolean',
            default: false
        })

    yargsInstance.command('$0 [app] [target]', chalk.green('runs the specified app\n'), (yargs) => {
        return yargs
            //  .positional('app', {
            //    describe: chalk.yellow('the app to run')
            // })
            .positional('target', {
                describe: chalk.yellow('the target of the app')
            })
    }, async (argv) => {
        // If editor flag is set, launch the editor and return

        if (argv.editor) {
            const flags = { "editor": true, "port": argv.port, "verbose": argv.verbose, "silent": argv.silent }
            await commandUtils.launchEditor(flags) // TODO use argv
            return
        }

        if (argv.repl) {
            // Initialize the app as usual, then start REPL
            const appManager = await commandUtils.runRepl(argv.app, argv)
            const repl = new REPL(appManager)
            await repl.start()
            return
        }

        // Check for web flag first, before app validation
        if (argv.web) {
            await commandUtils.handleOptions(argv)
            return
        }

        if (!argv.app && !argv.appDir) {
            console.log(chalk.cyan('Core apps:'))
            const apps = await commandUtils.listApps()
            console.log(chalk.green(`\t${apps.join('\n\t')}\n`))

            yargsInstance.showHelp()
            return
        } // argv.target,
        //  const flags = { "web": argv.web, "port": argv.port, "verbose": argv.verbose, "silent": argv.silent, "test": argv.test }
        // await commandUtils.begin(argv.app, argv.directory, argv.message, flags)
        await commandUtils.handleOptions(argv)
    })

    await yargsInstance.argv
}

main().catch(console.error)