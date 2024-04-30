// run.js - ES module style
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { promises as fs } from 'fs';
import path from 'path';

import logger from './src/utils/Logger.js'

import TransmissionBuilder from './src/mill/TransmissionBuilder.js'

const applicationsDir = './src/applications'

// logger.log('DESCRIBE ' + await transmission.describe())

class CommandUtils {
    static async run(dir, data, context) {
        logger.setLogLevel("info")
        logger.debug("Hello, logger!")
        logger.debug("process.cwd() = " + process.cwd())

        const transmissionConfigFile = path.join(dir, 'transmission.ttl')
        const servicesConfigFile = path.join(dir, 'services.ttl')

        const transmission = await TransmissionBuilder.build(transmissionConfigFile, servicesConfigFile)

        transmission.execute(data, context)
    }

    static async parseOrLoadContext(contextArg) {
        let context = ''
        try {
            // First, try to parse it directly as JSON
            //   logger.log('contextArg = ' + contextArg)
            context = JSON.parse(contextArg)
            //   logger.log('context from string = ' + context)

        } catch (err) {
            logger.log(err)
            // If it fails, assume it's a filename and try to load the file
            const filePath = path.resolve(contextArg); // Ensure the path is absolute
            const fileContent = await fs.readFile(filePath, 'utf8');
            context = JSON.parse(fileContent)
            logger.log('context from file = ' + context)
        }
        return context

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

let context = {}

if (process.argv.length <= 2) {
    // No arguments were provided, list subdirectories and exit
    console.log('Available applications :');
    CommandUtils.listSubdirectories(applicationsDir)
} else {
    await yargs(hideBin(process.argv))
        .usage('Usage: $0 <command> [options]')
        .option('context', {
            alias: 'c',
            describe: 'Context as a JSON string or a path to a JSON file',
            type: 'string',
        })
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
            const { dirName, input, context: contextArg } = argv

            const transmissionPath = path.join(applicationsDir, dirName)
            const defaultDataDir = path.join(transmissionPath, '/data')

            context = { "dataDir": defaultDataDir }

            // If a context argument was provided, parse or load it
            if (contextArg) {
                context = await CommandUtils.parseOrLoadContext(contextArg);
            }


            await CommandUtils.run(transmissionPath, input, context) // Pass additional data and context as needed
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


