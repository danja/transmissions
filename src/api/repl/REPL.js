// src/api/repl/REPL.js
// A simple REPL module for running transmissions with an app


import readline from 'readline';

export class REPL {
    constructor(app) {
        this.app = app;
    }

    async start() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'transmit> '
        });

        rl.prompt();

        for await (const line of rl) {
            const input = line.trim();
            if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
                rl.close();
                break;
            }
            const message = { content: input };
            try {
                // Assume app.runTransmissions returns a Promise with a result
                const result = await this.app.runTransmissions(message);
                console.log(result?.content ?? '[No response]');
            } catch (err) {
                // 'err' is unknown in ES modules, so print as string
                console.error('Error:', err && err.message ? err.message : String(err));
            }
            rl.prompt();
        }
    }
}
