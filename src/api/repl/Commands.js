// src/api/repl/Commands.js
// Command handler for REPL commands starting with '/'

export class Commands {
    static async quit(replInstance) {
        // Optionally perform cleanup here
        if (replInstance && replInstance.rl) {
            replInstance.rl.close();
        }
        process.exit(0);
    }

    // Add more commands as static async methods here
    // Example:
    // static async help(replInstance) {
    //     console.log('Available commands: /quit, /help');
    // }
}

export default Commands;
