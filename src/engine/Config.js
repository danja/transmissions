import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Config {
    static #instance = null; // Explicitly allowing null or Config type

    constructor() {
        const configPath = path.resolve(__dirname, '../../trans.config.json');
        try {
            const configData = fs.readFileSync(configPath, 'utf-8');
            this.settings = JSON.parse(configData);
        } catch (error) {
            console.error('Failed to load configuration:', error);
            this.settings = {};
        }
    }

    static getInstance() {
        if (!Config.#instance) {
            // Fixing type issue by ensuring Config.#instance is properly initialized
            Config.#instance = new Config();
        }
        return Config.#instance;
    }

    get(key) {
        return this.settings[key];
    }
}

export default Config;
