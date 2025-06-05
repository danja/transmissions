// src/api/repl/REPL.js
// A simple REPL module for running transmissions with an app

import readline from 'readline';
import chalk from 'chalk';
import Commands from './Commands.js';
import logger from '../../utils/Logger.js';

export class REPL {
    constructor(appManager) {
        this.appManager = appManager;
        this.previousLogLevel = 'info'; // within this
        this.verbosity = 0 // within the transmission, is quieter
    }

    async start() {
        logger.setLogLevel('info', true);
        logger.log(chalk.green.bold('╔══════════════════════════════════╗'));
        logger.log(chalk.green.bold('║') + chalk.green('      TRANSMISSIONS REPL       ') + chalk.green.bold('║'));
        logger.log(chalk.green.bold('╚══════════════════════════════════╝\n'));
        logger.log(chalk.blue('Type a message to process, or /help for commands\n'));

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk.cyan('\ntransmit> ')
        });

        this.rl.prompt();

        for await (const line of this.rl) {
            const input = line.trim();
            if (input.startsWith('/')) {
                const [cmd, ...args] = input.slice(1).split(/\s+/);
                if (typeof Commands[cmd] === 'function') {
                    await Commands[cmd](this, args);
                } else {
                    logger.warn(chalk.yellow(`[Unknown command: /${cmd}]`));
                }
                this.rl.prompt();
                continue;
            }

            var message = { content: input };
            //  try {

            this.setVerbosity()
            //  logger.log(`loglevel = ${logger.getLevel()}`)
            const response = await this.appManager.start(message);

            this.resetVerbosity()
            //   logger.log(`response = ${JSON.stringify(response)}`)
            // logger.error(JSON.stringify(response.content))
            // logger.debug('App response:');
            // logger.debug(JSON.stringify(result, null, 2));
            // } catch (err) {
            //   logger.error('Error: ' + (err && err.message ? err.message : String(err)));
            //}
            // Format the response with a nice border and color
            const responseLines = response.content.split('\n');
            const maxLength = responseLines.reduce((max, line) => Math.max(max, line.length), 0);
            const border = '─'.repeat(Math.min(maxLength, 80));

            logger.log('\n' + chalk.blue('┌' + border + '┐'));
            responseLines.forEach(line => {
                logger.log(chalk.blue('│') + ' ' + line + ' '.repeat(Math.max(0, maxLength - line.length)) + ' ' + chalk.blue('│'));
            });
            logger.log(chalk.blue('└' + border + '┘\n'));
            this.rl.prompt();
        }
    }

    setVerbosity() {
        this.previousLogLevel = logger.getLevel()
        let levelName;
        switch (this.verbosity) {
            case 0:
                logger.setLogLevel('silent');
                levelName = 'SILENT';
                break;
            case 2:
                logger.setLogLevel('debug');
                levelName = chalk.blue('DEBUG');
                break;
            case 1:
                logger.setLogLevel('info');
                levelName = chalk.green('INFO');
                break;
            case 3:
                logger.setLogLevel('warn');
                levelName = chalk.yellow('WARN');
                break;
            case 4:
                logger.setLogLevel('error');
                levelName = chalk.red('ERROR');
                break;
            default:
                logger.setLogLevel('info');
                levelName = chalk.green('INFO');
        }
        logger.log(chalk.gray(`[Log level set to: ${levelName}${chalk.gray(']')}`));
    }

    resetVerbosity() {
        //   logger.log(`resetVerbosity, previousLogLevel = ${this.previousLogLevel}`)
        logger.setLogLevel(this.previousLogLevel);
    }
}
