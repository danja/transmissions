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

    // TODO refactor all this out
    static async run(application, data, message = {}) {

        const appSplit = CommandUtils.splitName(application)
        const dir = appSplit.first
        const subtask = appSplit.second


        message.dataString = data // TODO tidy/remove
        //    message.rootApplication = application
        logger.setLogLevel("info")
        logger.debug("Hello, logger!")
        logger.debug("process.cwd() = " + process.cwd())

        var transmissionConfigFile = path.join(dir, 'transmissions.ttl')

        // TODO remove once files renamed
        try {
            await fs.access(transmissionConfigFile);
        } catch (error) {
            transmissionConfigFile = path.join(dir, 'transmission.ttl')
        }
        ////////////

        const servicesConfigFile = path.join(dir, 'services.ttl')

        const transmissions = await TransmissionBuilder.build(transmissionConfigFile, servicesConfigFile)

        if (subtask) {
            for (var i = 0; i < transmissions.length; i++) {
                if (subtask === transmissions[i].label) {
                    transmissions[i].execute(message)
                }
            }
        }
        else {
            for (var i = 0; i < transmissions.length; i++) {
                transmissions[i].execute(message)
            }
        }
    }

    static async parseOrLoadContext(contextArg) {
        let message = ''
        try {
            message = JSON.parse(contextArg)
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

    static splitName(input) {
        if (input.includes('.')) {
            let parts = input.split('.');
            return {
                first: parts[0],
                second: parts[1]
            };
        } else {
            return {
                first: input,
                second: false
            };
        }
    }
}

let message = {}

console.log('\nARGS')
for (var i = 0; i < process.argv.length; i++) {
    console.log(i + ' : ' + process.argv[i])
}
console.log('----')

if (process.argv.length <= 2) {
    // No arguments were provided, list subdirectories and exit
    console.log('Available applications :');
    CommandUtils.listSubdirectories(applicationsDir)
    // TODO add rest of help
} else {
    await yargs(hideBin(process.argv))
        .usage('Usage: $0 <application>[.subtask] [options] [target]')
        .option('message', {
            alias: 'm',
            describe: 'message as a JSON string or a path to a JSON file',
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
            const { application, target, message: contextArg } = argv
            console.log('application = ' + application)
            console.log('target = ' + target)
            console.log('message = ' + message)
            //   process.exit()

            const transmissionPath = path.join(applicationsDir, application)
            const defaultDataDir = path.join(transmissionPath, '/data')

            // TODO revisit base message, add constructor.name?
            message = { "dataDir": defaultDataDir }
            message.rootDir = application

            // If a message argument was provided, parse or load it
            if (contextArg) {
                message = await CommandUtils.parseOrLoadContext(contextArg);
            }

            message.applicationRootDir = path.join(fileURLToPath(import.meta.url), '../', transmissionPath)

            // Claude gave me this madness
            if (application === 'postcraft-init') {
                // Read the services.ttl file
                const servicesConfigFile = path.join(transmissionPath, 'services.ttl')
                let servicesContent = await fs.readFile(servicesConfigFile, 'utf8')

                // Replace the placeholder with the actual destination path
                servicesContent = servicesContent.replace('{{destinationPath}}', application)

                // Write the modified services.ttl back to a temporary file
                const tempServicesFile = path.join(transmissionPath, 'temp_services.ttl')
                await fs.writeFile(tempServicesFile, servicesContent)

                // Build and execute the transmission with the temporary services file
                const transmissionConfigFile = path.join(transmissionPath, 'transmission.ttl')
                const transmissions = await TransmissionBuilder.build(transmissionConfigFile, tempServicesFile)
                for (var i = 0; i < transmissions.length; i++) {
                    await transmissions[i].execute({
                        ...message,
                        source: "/home/danny/HKMS/postcraft/postcraft-template/", // TODO why is this hardcoded!?
                        destination: application,
                        rootDir: application
                    })
                }

                // Clean up the temporary file
                await fs.unlink(tempServicesFile)
            } else {
                await CommandUtils.run(transmissionPath, application, message)
            }
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


