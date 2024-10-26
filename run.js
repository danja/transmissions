// Example updated run.js


import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import CommandUtils from './src/api/CommandUtils.js'
import WebRunner from './src/api/WebRunner.js'

const applicationsDir = './src/applications'
const commandUtils = new CommandUtils(applicationsDir)

async function main() {
    await yargs(hideBin(process.argv))
        .usage('Usage: ./trans <application>[.subtask] [options] [target]')
        .option('message', {
            alias: 'm',
            describe: 'message as a JSON string or a path to a JSON file',
            type: 'string',
        })
        .option('web', {
            alias: 'w',
            describe: 'Start web interface',
            type: 'boolean',
        })
        .option('port', {
            alias: 'p',
            describe: 'Port for web interface',
            type: 'number',
            default: 3000
        })
        .command('$0 [application] [target]', 'runs the specified application', (yargs) => {
            return yargs
                .positional('application', {
                    describe: 'the application to run'
                })
                .positional('target', {
                    describe: 'the target of the application'
                })
        }, async (argv) => {
            if (argv.web) {
                const webRunner = new WebRunner(applicationsDir, argv.port)
                webRunner.start()
                return
            }

            if (!argv.application) {
                console.log('Available applications:')
                const apps = await commandUtils.listApplications()
                console.log(apps.join('\n'))
                return
            }

            let message = {}
            if (argv.message) {
                message = await CommandUtils.parseOrLoadContext(argv.message)
            }

            await commandUtils.run(argv.application, argv.target, message)
        })
        .help('h')
        .alias('h', 'help')
        .argv
}

main().catch(console.error)