import fs from 'fs/promises';
import path from 'path';
import Processor from '../base/Processor.js';
import logger from '../../utils/Logger.js';
import ns from '../../utils/ns.js';

class StringFilter extends Processor {
    constructor(config) {
        super(config);
        this.initialized = false;
        this.includePatterns = [];
        this.excludePatterns = [];
    }

    async process(message) {
        logger.log(`StringFilter.process, done=${message.done}`)
        if (message.done) return this.emit('message', message);

        await this.initialize();

        // TODO path handling needs updating
        if (!message.filepath) {
            logger.warn('StringFilter: No filepath provided, terminating pipe');
            return;
        }

        const relativePath = message.filepath;
        logger.debug(`StringFilter checking path = ${relativePath}`);

        if (this.isAccepted(relativePath)) {
            return this.emit('message', message);
        }
    }

    async initialize() {
        if (this.initialized) return;

        try {
            if (this.settings) {
                const includeStr = this.getProperty(ns.trn.includePatterns);
                const excludeStr = this.getProperty(ns.trn.excludePatterns);

                this.includePatterns = includeStr ? includeStr.split(',').map(p => p.trim()) : [];
                this.excludePatterns = excludeStr ? excludeStr.split(',').map(p => p.trim()) : [];
            }

            logger.debug(`StringFilter initialized with:
                Include patterns: ${this.includePatterns}
                Exclude patterns: ${this.excludePatterns}`);

        } catch (err) {
            logger.error('Error initializing StringFilter:', err);
            throw err;
        }

        this.initialized = true;
    }



    isAccepted(filePath) {
        // If no patterns defined, accept all
        if (this.includePatterns.length === 0 && this.excludePatterns.length === 0) {
            return true;
        }

        // Check exclude patterns first
        if (this.matchesAnyPattern(filePath, this.excludePatterns)) {
            return false;
        }

        // If include patterns exist, file must match at least one
        if (this.includePatterns.length > 0) {
            return this.matchesAnyPattern(filePath, this.includePatterns);
        }

        return true;
    }

    matchesAnyPattern(filePath, patterns) {
        return patterns.some(pattern => this.matchPattern(filePath, pattern));
    }

    matchPattern(filePath, pattern) {
        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');
        const regex = new RegExp(`^${regexPattern}$`);

        const filename = path.basename(filePath);
        return regex.test(filename) || regex.test(filePath);
    }
}

export default StringFilter;