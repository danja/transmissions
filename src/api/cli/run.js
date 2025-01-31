import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import CommandUtils from '../common/CommandUtils.js'
import WebRunner from '../http/server/WebRunner.js'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../../package.json')))
const buildInfo = process.env.BUILD_INFO || 'dev'
const version = `${packageJson.version} (${buildInfo})`

const banner = `
  _____
 |_   _| __ __ _ _ __  ___
   | || '__/ _\` | '_ \\/ __|
   | || | | (_| | | | \\__ \\
   |_||_|  \\__,_|_| |_|___/
             ${version.padStart(10).padEnd(20)}
         ${new Date().toISOString().split('T')[0]}
`

async function main() {
    console.log(chalk.cyan(banner))
    const commandUtils = new CommandUtils()

    const yargsInstance = yargs(hideBin(process.argv))
        .usage(chalk.cyan('Usage: ./trans [application][.subtask] [options] [target]\n  Run without arguments to list available applications.'))
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
        .option('message', {
            alias: 'm',
            describe: chalk.yellow('Input message as JSON'),
            type: 'string',
            coerce: JSON.parse
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
            default: 4200
        })

    yargsInstance.command('$0 [application] [target]', chalk.green('runs the specified application\n'), (yargs) => {
        return yargs
            .positional('application', {
                describe: chalk.yellow('the application to run')
            })
            .positional('target', {
                describe: chalk.yellow('the target of the application')
            })
    }, async (argv) => {
        if (argv.web) {
            const webRunner = new WebRunner(argv.port)
            await webRunner.start()
            return
        }

        if (!argv.application) {
            console.log(chalk.cyan('Available applications:'))
            const apps = await commandUtils.listApplications()
            console.log(chalk.green(apps.join('\n')))
            yargsInstance.showHelp()
            return
        }

        await commandUtils.begin(argv.application, argv.target, argv.message, argv.verbose)
    })

    await yargsInstance.argv
}

main().catch(console.error)