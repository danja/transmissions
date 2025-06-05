// src/api/repl/REPL.js
// A simple REPL module for running transmissions with an app


import readline from 'readline';
import Commands from './Commands.js';
import logger from '../../utils/Logger.js';

export class REPL {
    constructor(app) {
        this.app = app;
    }

    async start() {
        logger.setLogLevel('info');
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
                    await Commands[cmd](this, ...args);
                } else {
                    logger.warn(`[Unknown command: /${cmd}]`);
                }
                this.rl.prompt();
                continue;
            }
            if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
                this.rl.close();
                break;
            }
            const message = { content: input };
            try {
                const result = await this.app.start(message);
                logger.info(message.content)
                logger.debug('App response:');
                logger.debug(JSON.stringify(result, null, 2));
            } catch (err) {
                logger.error('Error: ' + (err && err.message ? err.message : String(err)));
            }
            this.rl.prompt();
        }
    }
}
