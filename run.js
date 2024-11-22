// run.js

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import CommandUtils from './src/api/CommandUtils.js'
import WebRunner from './src/api/WebRunner.js'

const defaultApplicationsDir = 'src/applications'
const commandUtils = new CommandUtils(defaultApplicationsDir)

async function main() {
    await yargs(hideBin(process.argv))
        .usage('Usage: ./trans <application>[.subtask] [options] [target]')
        .option('message', {
            alias: 'm',
            describe: 'Input message as JSON',
            type: 'string',
            coerce: JSON.parse
        })
        /*
        .option('payload', {
            alias: 'P',
            describe: 'message.payload as a JSON string or a path to a JSON file',
            type: 'string',
        })
            */
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
            //   if (argv.message) {
            //     message = await CommandUtils.parseOrLoadContext(argv.payload)
            //}

            //let message = {}
            /*
            if (argv.payload) {
                message = await CommandUtils.parseOrLoadContext(argv.payload)
            }
*/
            await commandUtils.begin(argv.application, argv.target, argv.message)
        })
        .help('h')
        .alias('h', 'help')
        .argv
}

main().catch(console.error)