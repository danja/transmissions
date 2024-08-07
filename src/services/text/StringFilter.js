// src/services/text/StringFilter.js
/**
 * @class StringFilter
 * @extends ProcessService
 * @classdesc
 * **a Transmissions Service**
 * 
 * Filters a string based on include and exclude patterns.
 *
 * ### Service Signature
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
 * * If not excluded, tests against include patterns
 * * Passes through the string if accepted
 * * Uses simplified glob-like pattern matching
 */

import logger from '../../utils/Logger.js';
import ProcessService from '../base/ProcessService.js';

class StringFilter extends ProcessService {
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
    isAccepted(input, exclude, include) {
        if (this.isExcluded(input, exclude)) {
            return false;
        }
        return this.isIncluded(input, include);
    }

    /**
     * Tests if the input string matches any of the exclude patterns
     * @param {string} input - The string to test
     * @param {string|string[]} exclude - Patterns to exclude
     * @returns {boolean} True if the string matches any exclude pattern
     */
    isExcluded(input, exclude) {
        if (!exclude || (Array.isArray(exclude) && exclude.length === 0) || exclude === '') {
            return false;
        }
        const patterns = Array.isArray(exclude) ? exclude : [exclude];
        return patterns.some(pattern => this.matchPattern(input, pattern));
    }

    /**
     * Tests if the input string matches any of the include patterns
     * @param {string} input - The string to test
     * @param {string|string[]} include - Patterns to include
     * @returns {boolean} True if the string matches any include pattern or if include is empty
     */
    isIncluded(input, include) {
        if (!include || (Array.isArray(include) && include.length === 0) || include === '') {
            return true;
        }
        const patterns = Array.isArray(include) ? include : [include];
        return patterns.some(pattern => this.matchPattern(input, pattern));
    }

    /**
     * Matches a string against a glob-like pattern
     * @param {string} input - The string to match
     * @param {string} pattern - The pattern to match against
     * @returns {boolean} True if the string matches the pattern
     */
    matchPattern(input, pattern) {
        const regexPattern = pattern
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.')
            .replace(/\[([^\]]+)\]/g, '[${1}]');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(input);
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