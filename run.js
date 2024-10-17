// CommandUtils.js - run.js helpers

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
// import { promises as fs } from 'fs';
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url';


//import TransmissionBuilder from './src/engine/TransmissionBuilder.js'


import logger from './src/utils/Logger.js'
import CommandUtils from './src/utils/CommandUtils.js'

var applicationsDir = './src/applications' // default inside transmissions



// logger.log('DESCRIBE ' + await transmission.describe())



let message = {}

logger.setLogLevel("info")
//console.log('\nARGS')
//for (var i = 0; i < process.argv.length; i++) {
//  console.log(i + ' : ' + process.argv[i])
//}
//console.log('----')

if (process.argv.length <= 2) {
    // No arguments were provided, list subdirectories and exit
    console.log('Available applications :');
    CommandUtils.listSubdirectories(applicationsDir)
    // TODO add rest of help
} else {
    await yargs(hideBin(process.argv))
        .usage('Usage: ./trans <application>[.subtask] [options] [target]')
        .option('message', {
            alias: 'm',
            describe: 'message as a JSON string or a path to a JSON file',
            type: 'string',
        })
        .option('dir', {
            alias: 'd',
            describe: 'application directory',
            type: 'string',
        })
        .command('$0 <application> [target]', 'runs the specified application', (yargs) => {
            return yargs.positional('application', {
                describe: 'the application to run'
            })
                .positional('target', {
                    describe: 'the target of the application'
                    //    default: '' // Default value if the second argument is not provided
                })
        }, async (argv) => {
            const { dir, application, target, message: contextArg } = argv
            if (dir) {
                applicationsDir = dir
            }
            logger.setLogLevel("info")
            logger.debug('\n**** run.js, async (args)')
            logger.debug('applicationsDir = ' + applicationsDir)
            logger.debug('application = ' + application)
            logger.debug('target = ' + target)
            // logger.reveal('message = ' + message)

            const modulePath = path.join(applicationsDir, application, 'processors');
            await CommandUtils.run(applicationsDir, application, target, message, modulePath);
        })
        .help('h')
        .alias('h', 'help')

        .fail((msg, err, yargs) => {
            if (err) throw err; // Preserve stack
            console.error(msg);
            process.exit(1);
        })
        .argv
}


