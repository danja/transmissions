#!/usr/bin/env node
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log(chalk.cyan(`
  _____                           _         _                 
 |_   _| __ __ _ _ __  ___ _ __ _(_)___ ___(_) ___  _ __  ___ 
   | || '__/ _\` | '_ \\/ __| '_ \\| / __/ __| |/ _ \\| '_ \\/ __|
   | || | | (_| | | | \\__ \\ | | | \\__ \\__ \\ | (_) | | | \\__ \\
   |_||_|  \\__,_|_| |_|___/_| |_|_|___/___/_|\\___/|_| |_|___/
                                                             
                     Webpack Dev Server
`));

// Start webpack dev server
console.log(chalk.green('Starting webpack dev server...'));

const webpackProcess = spawn('npx', ['webpack', 'serve', '--config', 'webpack.config.js', '--mode', 'development'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
});

webpackProcess.on('error', (error) => {
    console.error(chalk.red(`Failed to start webpack dev server: ${error.message}`));
    process.exit(1);
});

webpackProcess.on('close', (code) => {
    if (code !== 0) {
        console.error(chalk.red(`Webpack dev server exited with code ${code}`));
        process.exit(code);
    }
});

// Handle SIGINT and SIGTERM
process.on('SIGINT', () => {
    console.log(chalk.yellow('\nShutting down webpack dev server...'));
    webpackProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
    console.log(chalk.yellow('\nShutting down webpack dev server...'));
    webpackProcess.kill('SIGTERM');
});
