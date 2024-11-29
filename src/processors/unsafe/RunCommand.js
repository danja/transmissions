import { exec } from 'child_process';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';
import ns from '../../utils/ns.js';

class RunCommand extends Processor {
    constructor(config) {
        super(config);
        this.allowedCommands = config.allowedCommands || [];
        this.blockedPatterns = config.blockedPatterns || [];
        this.timeout = config.timeout || 5000;
        this.initializeSecurity();
    }

    async initializeSecurity() {
        if (this.configKey) {
            const allowed = await this.getPropertyFromMyConfig(ns.trm.allowedCommands);
            this.allowedCommands = allowed ? allowed.split(',') : [];

            const blocked = await this.getPropertyFromMyConfig(ns.trm.blockedPatterns);
            this.blockedPatterns = blocked ? blocked.split(',') : [];
        }
    }

    validateCommand(command) {
        if (!command) {
            throw new Error('No command specified');
        }

        const commandName = command.split(' ')[0];
        const isAllowed = this.allowedCommands.length === 0 ||
            this.allowedCommands.includes(commandName);

        if (!isAllowed) {
            throw new Error(`Command '${commandName}' not in allowed list`);
        }

        const hasBlocked = this.blockedPatterns.some(pattern =>
            command.includes(pattern)
        );
        if (hasBlocked) {
            throw new Error('Command contains blocked pattern');
        }
    }

    async process(message) {
        let command = message.command;
        if (!command) {
            command = this.getPropertyFromMyConfig(ns.trm.command);
        }

        try {
            this.validateCommand(command);
            const result = await this.executeCommand(command);
            message.content = result.stdout;
            message.commandResult = result;
            logger.debug(`Command executed successfully: ${command}`);
        } catch (error) {
            logger.error(`Command error: ${error.message}`);
            message.commandError = error.message;
            message.content = error.message;
            throw error;
        }

        return this.emit('message', message);
    }

    executeCommand(command) {
        return new Promise((resolve, reject) => {
            const child = exec(command, {
                timeout: this.timeout
            }, (error, stdout, stderr) => {
                if (error) {
                    if (error.signal === 'SIGTERM') {
                        reject(new Error('Command timeout'));
                    } else {
                        reject(error);
                    }
                    return;
                }
                resolve({
                    stdout: stdout.toString(),
                    stderr: stderr.toString(),
                    code: 0
                });
            });
        });
    }
}

export default RunCommand;