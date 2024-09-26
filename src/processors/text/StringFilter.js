// src/processors/text/StringFilter.js
/**
 * @class StringFilter
 * @extends ProcessProcessor
 * @classdesc
 * **a Transmissions Processor**
 * 
 * Filters a string based on include and exclude patterns.
 *
 * ### Processor Signature
 * 
 * #### __*Input*__
 * * **`message.content`** - The string to be filtered
 * * **`message.exclude`** - Patterns to exclude (blacklist)
 * * **`message.include`** - Patterns to include (whitelist)
 * 
 * #### __*Output*__
 * * **`message.content`** - The string (if accepted)
 * 
 * #### __*Behavior*__
 * * Tests input string against exclude patterns
 * * first the value of `message.content` is tested against `message.exclude`, if a match **isn't** found, `message.content` is passed through to the output
 * * next the value of `message.content` is tested against `message.include`, if a match **is** found, `message.content` is passed through to the output
 * * Uses simplified glob-like pattern matching
 */

import logger from '../../utils/Logger.js';
import ProcessProcessor from '../base/ProcessProcessor.js';

class StringFilter extends ProcessProcessor {
    constructor(config) {
        super(config);
    }

    /**
     * Tests if the input string is accepted based on exclude and include patterns
     * @param {string} input - The string to test
     * @param {string|string[]} exclude - Patterns to exclude
     * @param {string|string[]} include - Patterns to include
     * @returns {boolean} True if the string is accepted, false otherwise
     */
    isAccepted(content, exclude, include) {
        // Reject undefined content
        if (content === undefined) {
            return false;
        }

        // If no include or exclude patterns, accept all
        if ((!exclude || exclude.length === 0) && (!include || include.length === 0)) {
            return true;
        }

        // Check exclude patterns first
        if (this.isExcluded(content, exclude)) {
            return false;
        }

        // If include patterns exist, content must match at least one
        if (include && include.length > 0) {
            return this.isIncluded(content, include);
        }

        // If no include patterns, accept content that wasn't excluded
        return true;
    }


    /**
     * Tests if the input string matches any of the exclude patterns
     * @param {string} input - The string to test
     * @param {string|string[]} exclude - Patterns to exclude
     * @returns {boolean} True if the string matches any exclude pattern
     */
    isExcluded(content, exclude) {
        if (!exclude || exclude.length === 0) {
            return false;
        }
        const patterns = Array.isArray(exclude) ? exclude : [exclude];
        return patterns.some(pattern => this.matchPattern(content, pattern));
    }

    /**
     * Tests if the input string matches any of the include patterns
     * @param {string} input - The string to test
     * @param {string|string[]} include - Patterns to include
     * @returns {boolean} True if the string matches any include pattern or if include is empty
     */
    isIncluded(content, include) {
        if (!include || include.length === 0) {
            return true;
        }
        const patterns = Array.isArray(include) ? include : [include];
        return patterns.some(pattern => this.matchPattern(content, pattern));
    }

    /**
     * Matches a string against a glob-like pattern
     * @param {string} input - The string to match
     * @param {string} pattern - The pattern to match against
     * @returns {boolean} True if the string matches the pattern
     */
    matchPattern(content, pattern) {
        const regexPattern = pattern
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.')
            .replace(/\[([^\]]+)\]/g, '[$1]');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(content);
    }

    async execute(message) {
        logger.debug('\nStringFilter Input : \nmessage.content = ' + message.content);
        logger.debug('message.exclude = ');
        logger.reveal(message.exclude);
        logger.debug('message.include = ');
        logger.reveal(message.include);

        const accepted = this.isAccepted(message.content, message.exclude, message.include);

        if (accepted) {
            logger.debug('\nOutput : \nmessage.content = ' + message.content);
            this.emit('message', message);
        } else {
            logger.debug('\nString filtered out');
        }
    }
}

export default StringFilter;