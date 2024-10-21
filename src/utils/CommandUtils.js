// run.js
import path from 'path'
import fs from 'fs/promises'

import logger from './Logger.js'
import TransmissionBuilder from '../engine/TransmissionBuilder.js'

const defaultTransmissionsFilename = 'transmissions.ttl'
const defaultProcessorsConfigFile = 'processors-config.ttl'

class CommandUtils {
    static async run(appsDir, application, target, message = {}) {
        logger.setLogLevel('debug');
        logger.debug('\nCommandUtils.run()');
        logger.debug('CommandUtils, appsDir =' + appsDir);
        logger.debug('CommandUtils, application =' + application);
        logger.debug('CommandUtils, target =' + target);





        const normalizedAppPath = path.normalize(application);
        const isRemoteModule = normalizedAppPath.startsWith('..');

        const appSplit = CommandUtils.splitName(normalizedAppPath);
        const appName = appSplit.first;
        const subtask = appSplit.second;

        logger.debug('appName = ' + appName);
        logger.debug('subtask  = ' + subtask);

        const transmissionsDir = isRemoteModule
            ? normalizedAppPath  // Use the full path for remote modules
            : path.join(appsDir, appName);

        const modulePath = path.join(transmissionsDir, 'processors'); /////////////  '/'
        logger.debug('in CommandUtils, modulePath = ' + modulePath);


        logger.debug('transmissionsDir = ' + transmissionsDir);

        const transmissionsFile = path.join(transmissionsDir, 'transmissions.ttl');
        const processorsConfigFile = path.join(transmissionsDir, 'processors-config.ttl');

        logger.debug("transmissionConfigFile = " + transmissionsFile);
        logger.debug("processorsConfigFile = " + processorsConfigFile);

        const defaultDataDir = path.join(transmissionsDir, '/data');
        message = { "dataDir": defaultDataDir };
        message.rootDir = target;
        if (!message.rootDir) {
            message.rootDir = application // might need message.datasetFilename?
        }

        const transmissions = await TransmissionBuilder.build(
            transmissionsFile,
            processorsConfigFile,
            modulePath
        );

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

    static splitName(fullPath) {
        const parts = fullPath.split(path.sep);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) {
            const [name, task] = lastPart.split('.');
            return { first: name, second: task };
        }
        return { first: lastPart, second: false };
    }
}

export default CommandUtils
