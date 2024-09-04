// run.js - ES module style
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
// import { promises as fs } from 'fs';
import path from 'path'
import fs from 'fs/promises'

import TransmissionBuilder from './src/engine/TransmissionBuilder.js'
import { fileURLToPath } from 'url';

import logger from './src/utils/Logger.js'

var applicationsDir = './src/applications'



// logger.log('DESCRIBE ' + await transmission.describe())

class CommandUtils {

    // TODO refactor all this out
    static async run(appsDir, application, message = {}) {


        logger.debug('\nRUN, appsDir =' + appsDir)
        logger.debug('RUN, application =' + application)

        const appSplit = CommandUtils.splitName(application)

        var appName = appSplit.first
        logger.debug(' = ' + appName)
        //     if (appsDir) {
        //       dir = appsDir // path.join(appsDir, dir)
        // }
        var dir = path.join(appsDir, appName)
        ///  path.join(appsDir, appName)
        logger.debug('DIR = ' + dir)
        const subtask = appSplit.second

        // message.dataString = data // TODO tidy/remove
        //    message.rootApplication = application

        logger.debug("run.js, Hello, logger!")
        logger.debug("process.cwd() = " + process.cwd())

        logger.debug("dir = " + dir)
        var transmissionConfigFile = path.join(dir, 'transmissions.ttl')


        // TODO remove once files renamed
        //   try {
        //     await fs.access(transmissionConfigFile);
        //} catch (error) {
        //  transmissionConfigFile = path.join(dir, 'transmission.ttl')
        //}
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
            logger.setLogLevel("info")
            logger.debug('dir = ' + dir)
            logger.debug('application = ' + application)
            logger.debug('target = ' + target)
            // logger.reveal('message = ' + message)

            // process.exit()

            // TODO this is a bloody mess. Refactor!
            const appSplit = CommandUtils.splitName(application)
            //  var dir = appSplit.first

            logger.debug('appSplit.first = ' + appSplit.first)
            //  if (dir) {
            //    applicationsDir = path.join(dir, appSplit.first) // TODO refactor
            // }
            logger.debug('appsDir = ' + applicationsDir)

            const transmissionPath = path.join(applicationsDir, application)
            const defaultDataDir = path.join(transmissionPath, '/data')

            //      applicationsDir, application
            logger.debug('\nA PRERUN  applicationsDir =' + applicationsDir)
            logger.debug('\nA PRERUN  application =' + application)
            logger.debug('\n')
            // TODO revisit base message, add constructor.name?
            message = { "dataDir": defaultDataDir }
            message.rootDir = target // application

            // If a message argument was provided, parse or load it
            if (contextArg) {
                message = await CommandUtils.parseOrLoadContext(contextArg);
            }

            if (dir) { // TODO refactor with above
                message.applicationRootDir = applicationsDir
            } else {
                message.applicationRootDir = path.join(fileURLToPath(import.meta.url), '../', transmissionPath)
            }

            logger.debug('transmissionPath = ' + transmissionPath)
            //    process.exit()

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
                await CommandUtils.run(applicationsDir, application, message)

                // run(appsDir, application, data, message = {}) {
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


