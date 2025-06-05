// src/api/repl/REPL.js
// A simple REPL module for running transmissions with an app


import readline from 'readline';
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
        logger.log('Welcome to the REPL!\n')
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'transmit> '
        });

        this.rl.prompt();

        for await (const line of this.rl) {
            const input = line.trim();
            if (input.startsWith('/')) {
                const [cmd, ...args] = input.slice(1).split(/\s+/);
                if (typeof Commands[cmd] === 'function') {
                    await Commands[cmd](this, args);
                } else {
                    logger.warn(`[Unknown command: /${cmd}]`);
                }
                this.rl.prompt();
                continue;
            }

            var message = { content: input };
            //  try {

            this.setVerbosity()
            logger.log(`loglevel = ${logger.getLevel()}`)
            const response = await this.appManager.start(message);

            this.resetVerbosity()
            //   logger.log(`response = ${JSON.stringify(response)}`)
            // logger.error(JSON.stringify(response.content))
            // logger.debug('App response:');
            // logger.debug(JSON.stringify(result, null, 2));
            // } catch (err) {
            //   logger.error('Error: ' + (err && err.message ? err.message : String(err)));
            //}
            logger.log(response.content)
            this.rl.prompt();
        }
    }

    setVerbosity() {
        this.previousLogLevel = logger.getLevel()
        switch (this.verbosity) {
            case 0:
                logger.setLogLevel('silent');
                break;
            case 2:
                logger.setLogLevel('debug');
                break;
            case 1: // Yuck!
                logger.setLogLevel('info');
                break;
            case 3:
                logger.setLogLevel('warn');
                break;
            case 4:
                logger.setLogLevel('error');
                break;
            default:
                logger.setLogLevel('info');
        }
    }

    resetVerbosity() {
        //   logger.log(`resetVerbosity, previousLogLevel = ${this.previousLogLevel}`)
        logger.setLogLevel(this.previousLogLevel);
    }
}
