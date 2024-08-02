// run.js - ES module style
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
// import { promises as fs } from 'fs';
import path from 'path'
import fs from 'fs/promises'

import TransmissionBuilder from './src/engine/TransmissionBuilder.js'
import { fileURLToPath } from 'url';

import logger from './src/utils/Logger.js'


const applicationsDir = './src/applications'

// logger.log('DESCRIBE ' + await transmission.describe())

class CommandUtils {
    static async run(dir, data, message = {}) {
        message.dataString = data // TODO tidy/remove
        //    message.rootDir = dir
        logger.setLogLevel("info")
        logger.debug("Hello, logger!")
        logger.debug("process.cwd() = " + process.cwd())

        const transmissionConfigFile = path.join(dir, 'transmission.ttl')
        const servicesConfigFile = path.join(dir, 'services.ttl')

        const transmissions = await TransmissionBuilder.build(transmissionConfigFile, servicesConfigFile)

        for (var i = 0; i < transmissions.length; i++) {
            transmissions[i].execute(message)
        }
    }

    static async parseOrLoadContext(contextArg) {
        let message = ''
        try {
            // First, try to parse it directly as JSON
            //   logger.log('contextArg = ' + contextArg)
            message = JSON.parse(contextArg)
            //   logger.log('message from string = ' + message)

        } catch (err) {
            logger.log(err)
            // If it fails, assume it's a filename and try to load the file
            const filePath = path.resolve(contextArg); // Ensure the path is absolute
            const fileContent = await fs.readFile(filePath, 'utf8');
            message = JSON.parse(fileContent)
            logger.log('message from file = ' + message)
        }
        return message

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

let message = {}

if (process.argv.length <= 2) {
    // No arguments were provided, list subdirectories and exit
    console.log('Available applications :');
    CommandUtils.listSubdirectories(applicationsDir)
} else {
    await yargs(hideBin(process.argv))
        .usage('Usage: $0 <command> [options]')
        .option('message', {
            alias: 'c',
            describe: 'Message as a JSON string or a path to a JSON file',
            type: 'string',
        })
        .command('$0 <dirName> [input]', 'Runs the specified transmission with optional input value', (yargs) => {
            return yargs.positional('dirName', {
                describe: 'The transmission to run',
                type: 'string'
            })
                .positional('input', {
                    describe: 'The optional input',
                    type: 'string',
                    default: '' // Default value if the second argument is not provided
                })
        }, async (argv) => {
            const { dirName, input, message: contextArg } = argv

            const transmissionPath = path.join(applicationsDir, dirName)
            const defaultDataDir = path.join(transmissionPath, '/data')

            // TODO revisit base message, add constructor.name?
            message = { "dataDir": defaultDataDir }
            message.rootDir = input

            // If a message argument was provided, parse or load it
            if (contextArg) {
                message = await CommandUtils.parseOrLoadContext(contextArg);
            }

            message.applicationRootDir = path.join(fileURLToPath(import.meta.url), '../', transmissionPath)

            // Claude gave me this madness
            if (dirName === 'postcraft-init') {
                // Read the services.ttl file
                const servicesConfigFile = path.join(transmissionPath, 'services.ttl')
                let servicesContent = await fs.readFile(servicesConfigFile, 'utf8')

                // Replace the placeholder with the actual destination path
                servicesContent = servicesContent.replace('{{destinationPath}}', input)

                // Write the modified services.ttl back to a temporary file
                const tempServicesFile = path.join(transmissionPath, 'temp_services.ttl')
                await fs.writeFile(tempServicesFile, servicesContent)

                // Build and execute the transmission with the temporary services file
                const transmissionConfigFile = path.join(transmissionPath, 'transmission.ttl')
                const transmissions = await TransmissionBuilder.build(transmissionConfigFile, tempServicesFile)
                for (var i = 0; i < transmissions.length; i++) {
                    await transmissions[i].execute({
                        ...message,
                        source: "/home/danny/HKMS/postcraft/postcraft-template/",
                        destination: input,
                        rootDir: input
                    })
                }

                // Clean up the temporary file
                await fs.unlink(tempServicesFile)
            } else {
                await CommandUtils.run(transmissionPath, input, message)
            }
        })
        /*
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
            const { dirName, input, message: contextArg } = argv // TODO what's that arg for message?

            const transmissionPath = path.join(applicationsDir, dirName)
            const defaultDataDir = path.join(transmissionPath, '/data')

            // TODO revisit base message, add constructor.name?
            message = { "dataDir": defaultDataDir }
            message.rootDir = input

            // If a message argument was provided, parse or load it
            if (contextArg) {
                message = await CommandUtils.parseOrLoadContext(contextArg);
            }

            message.applicationRootDir = path.join(fileURLToPath(import.meta.url), '../', transmissionPath)
            await CommandUtils.run(transmissionPath, input, message) // Pass additional data and message as needed
        })
        */
        .help('h')
        .alias('h', 'help')

        .fail((msg, err, yargs) => {
            if (err) throw err; // Preserve stack
            console.error(msg);
            process.exit(1);
        })
        .argv
}


