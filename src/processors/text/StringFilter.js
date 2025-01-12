import fs from 'fs/promises';
import path from 'path';
import Processor from '../base/Processor.js';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';

class StringFilter extends Processor {
    constructor(config) {
        super(config);
        this.gitignorePatterns = [];
        this.initialized = false;
        this.initialize();
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Get include/exclude patterns from config
            if (this.settings) {
                this.includePatterns = this.getPropertyFromMyConfig(ns.trn.include)?.split(',') || [];
                this.excludePatterns = this.getPropertyFromMyConfig(ns.trn.exclude)?.split(',') || [];
            } else {
                this.includePatterns = this.config.include?.split(',') || [];
                this.excludePatterns = this.config.exclude?.split(',') || [];
            }

            // Try to load gitignore if path provided
            const gitignorePath = this.config.gitignorePath;
            if (gitignorePath) {
                try {
                    const gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
                    this.gitignorePatterns = gitignoreContent
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line && !line.startsWith('#'));
                } catch (err) {
                    logger.warn(`Could not load gitignore from ${gitignorePath}: ${err.message}`);
                }
            }
        } catch (err) {
            logger.error('Error initializing StringFilter:', err);
        }

        this.initialized = true;
    }

    async process(message) {
        await this.initialize();

        if (!message.filepath) {
            logger.warn('StringFilter: No filepath provided');
            return;
        }

        const relativePath = message.filepath;
        logger.debug(`StringFilter, relative path = ${relativePath}`);

        // Check gitignore patterns
        if (this.gitignorePatterns.some(pattern => this.matchPattern(relativePath, pattern))) {
            return;
        }

        // Check exclude patterns
        if (this.excludePatterns.some(pattern => this.matchPattern(relativePath, pattern))) {
            return;
        }

        // Check include patterns
        if (this.includePatterns.length > 0 &&
            !this.includePatterns.some(pattern => this.matchPattern(relativePath, pattern))) {
            return;
        }

        return this.emit('message', message);
    }

    matchPattern(filePath, pattern) {
        // Convert glob pattern to regex
        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        const regex = new RegExp(`^${regexPattern}$`);

        // Get filename for matching
        const filename = path.basename(filePath);
        return regex.test(filename) || regex.test(filePath);
    }
}

export default StringFilter;