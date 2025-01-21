import path from 'path';
import logger from '../../utils/Logger.js';
import Processor from '../base/Processor.js';
import ns from '../../utils/ns.js';

class StringFilter extends Processor {
    constructor(config) {
        super(config);
        this.initialized = false;
        this.includePatterns = [];
        this.excludePatterns = [];
    }

    async initialize() {
        if (this.initialized) return;

        try {
            this.includePatterns = this.getValues(ns.trn.includePattern);
            this.excludePatterns = this.getValues(ns.trn.excludePattern);

            logger.debug('Initialized patterns:', {
                include: this.includePatterns,
                exclude: this.excludePatterns
            });

            this.initialized = true;
        } catch (error) {
            logger.error('StringFilter initialization failed:', error);
            throw error;
        }
    }

    matchPattern(filePath, pattern) {
        try {
            const regexPattern = pattern
                .replace(/\./g, '\\.')
                .replace(/\*/g, '.*')
                .replace(/\?/g, '.');
            const regex = new RegExp(`^${regexPattern}$`);
            const filename = path.basename(filePath);
            return regex.test(filename);
        } catch (error) {
            logger.error('Pattern matching error:', { pattern, error });
            return false;
        }
    }

    isAccepted(filePath) {
        if (!filePath) return false;

        if (this.excludePatterns.length === 0 && this.includePatterns.length === 0) {
            return true;
        }

        for (const pattern of this.excludePatterns) {
            if (this.matchPattern(filePath, pattern)) {
                logger.debug(`File ${filePath} excluded by pattern ${pattern}`);
                return false;
            }
        }

        if (this.includePatterns.length > 0) {
            for (const pattern of this.includePatterns) {
                if (this.matchPattern(filePath, pattern)) {
                    logger.debug(`File ${filePath} included by pattern ${pattern}`);
                    return true;
                }
            }
            return false;
        }

        return true;
    }

    async process(message) {
        if (message.done) {
            return this.emit('message', message);
        }

        await this.initialize();

        if (!message.filepath) {
            logger.warn('StringFilter: No filepath provided');
            return;
        }

        if (this.isAccepted(message.filepath)) {
            return this.emit('message', message);
        }
    }
}

export default StringFilter;