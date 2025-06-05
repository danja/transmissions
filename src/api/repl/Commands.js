// src/api/repl/Commands.js
// Command handler for REPL commands starting with '/'

import logger from '../../utils/Logger.js';
import CommandUtils from '../common/CommandUtils.js';

export class Commands {

    static async app(replInstance, args) {
        if (!args || args.length === 0) {
            logger.warn('Usage: /app <appName>');
            return;
        }
        const appName = args[0];
        // Use the same argv as the current REPL, but swap app name
        const argv = replInstance.argv || {};
        argv.app = appName;
        const commandUtils = new CommandUtils();
        replInstance.app = await commandUtils.runRepl(appName, argv);
        logger.info(`Switched to app: ${appName}`);
    }

    static async args(replInstance, args) {
        logger.log(`Arguments: ${args.join(' ')}`);
    }

    static async q(replInstance) {
        Commands.quit(replInstance);
    }

    static async quit(replInstance) {
        if (replInstance && replInstance.rl) {
            replInstance.rl.close();
        }
        process.exit(0);
    }

    static async more(replInstance) {
        if (replInstance && replInstance.rl) {
            replInstance.verbosity++;
            logger.info(`Verbosity = ${replInstance.verbosity}`);
        }
    }

    static async less(replInstance) {
        if (replInstance && replInstance.rl) {
            replInstance.verbosity--;
            logger.info(`Verbosity = ${replInstance.verbosity}`);
        }
    }

    static async help(replInstance) {
        logger.info('Available commands:');
        logger.info('/help - Show this help message');
        logger.info('/quit - Exit the REPL');
        logger.info('/q - Alias for /quit');
        logger.info('/more - Increase verbosity');
        logger.info('/less - Decrease verbosity');
    }
}

export default Commands;
