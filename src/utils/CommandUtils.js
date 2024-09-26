// run.js - ES module style
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
// import { promises as fs } from 'fs';
import path from 'path'
import fs from 'fs/promises'

import TransmissionBuilder from '../engine/TransmissionBuilder.js'
import { fileURLToPath } from 'url';

import logger from './Logger.js'

var applicationsDir = '../applications'

const defaultTransmissionsFilename = 'transmissions.ttl'
const defaultProcessorsConfigFile = 'processors-config.ttl'

class CommandUtils {

    // TODO refactor all this out
    static async run(appsDir, application, target, message = {}) {
        logger.setLogLevel('debug')
        //  logger.debug("run.js, Hello, logger!")
        // logger.debug("process.cwd() = " + process.cwd())
        logger.debug('\nCommandUtils.run()')

        logger.debug('CommandUtils, appsDir =' + appsDir)
        logger.debug('CommandUtils, application =' + application)
        logger.debug('CommandUtils, target =' + target)

        const appSplit = CommandUtils.splitName(application)
        const appName = appSplit.first
        const subtask = appSplit.second

        logger.debug('appName = ' + appName)
        logger.debug('subtask  = ' + subtask)

        var transmissionsDir = path.join(appsDir, appName)

        logger.debug('transmissionsDir = ' + transmissionsDir)

        const transmissionsFile = path.join(transmissionsDir, defaultTransmissionsFilename)
        const processorsConfigFile = path.join(transmissionsDir, defaultProcessorsConfigFile)

        logger.debug("transmissionConfigFile = " + transmissionsFile)
        logger.debug("processorsConfigFile = " + processorsConfigFile)



        const defaultDataDir = path.join(transmissionsDir, '/data')
        message = { "dataDir": defaultDataDir }
        message.rootDir = target // application target dir

        // process.exit()

        const transmissions = await TransmissionBuilder.build(transmissionsFile, processorsConfigFile)

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

export default CommandUtils
