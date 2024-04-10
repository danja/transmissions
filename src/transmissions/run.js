// run.js (ES6 Module style)
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { promises as fs } from 'fs';
import path from 'path';

import logger from '../utils/Logger.js'
import footpath from '../utils/footpath.js'

import TransmissionBuilder from '../mill/TransmissionBuilder.js'

const transmissionsDir = './src/transmissions'

class CommandUtils {
    static async run(dir, data, context) {
        logger.setLogLevel("debug")
        logger.debug("Hello, logger!")
        logger.debug("process.cwd() = " + process.cwd())

        const transmissionConfigFile = path.join(dir, 'transmission.ttl')
        const servicesConfigFile = path.join(dir, 'services.ttl')

        const transmission = await TransmissionBuilder.build(transmissionConfigFile, servicesConfigFile)

        transmission.execute(data, context)
    }

    static async listSubdirectories(currentDirectory) {
        try {
            const entries = await fs.readdir(currentDirectory, { withFileTypes: true });

            const subdirChecks = entries.filter(dirent => dirent.isDirectory()).map(async (dirent) => {
                const subdirPath = path.join(currentDirectory, dirent.name);
                const files = await fs.readdir(subdirPath);
                return files.includes('about.md') ? dirent.name : null;
            })

            // Resolve all promises from subdirChecks and filter out null values
            const subdirsContainingAboutMd = (await Promise.all(subdirChecks)).filter(name => name !== null);

            subdirsContainingAboutMd.forEach(dir => console.log(dir));
        } catch (err) {
            console.error('Error listing subdirectories:', err);
        }
    }
}


if (process.argv.length <= 2) {
    // No arguments were provided, list subdirectories and exit
    console.log('Available transmissions :');
    CommandUtils.listSubdirectories(transmissionsDir)
} else {
    await yargs(hideBin(process.argv))
        .usage('Usage: $0 <command> [options]')
        .command('$0 <dirName> [input]', 'Runs the specified transmission with optional input value', (yargs) => {
            return yargs.positional('dirName', {
                describe: 'The transmission to run',
                type: 'string'
            })
                .positional('input', {
                    describe: 'The optional input',
                    type: 'string', // Specify the type of the second argument
                    default: '' // Default value if the second argument is not provided
                })
        }, async (argv) => {
            // commandExecuted = true
            const { dirName, input } = argv
            // Assuming the directories are within a specific path, adjust as necessary
            const dirPath = path.join(transmissionsDir, dirName);
            await CommandUtils.run(dirPath, input, {}) // Pass additional data and context as needed
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


