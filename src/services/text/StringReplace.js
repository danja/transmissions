// src/services/text/StringReplace.js
/**
 * @class StringReplace
 * @extends ProcessService
 * @classdesc
 * **a Transmissions Service**
 * 
 * Replaces all occurrences of a specified substring in the content with a replacement string.
 * 
 * ### Signature
 * 
 * #### __*Input*__
 * * **`message.content`** - The original string content
 * * **`message.match`** - The substring to be replaced
 * * **`message.replace`** - The replacement string
 * 
 * #### __*Output*__
 * * **`message.content`** - The modified string with replacements
 * 
 * #### __*Behavior*__
 * * Replaces every exact occurrence of `message.match` in `message.content` with `message.replace`
 * * If `message.match` is not found, the content remains unchanged
 * 
 * #### __Tests__
 * * TODO: Add test information
 */

import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'

class StringReplace extends ProcessService {
    constructor(config) {
        super(config)
    }

    /**
     * Executes the string replacement process
     * @param {Object} message - The message object containing content, match, and replace strings
     */
    async execute(message) {
        logger.debug('StringReplace input: ' + message.content)

        if (message.content && message.match && message.replace) {
            // Perform global replacement
            message.content = message.content.split(message.match).join(message.replace)
        } else {
            logger.warn('StringReplace: Missing required properties in message')
        }

        logger.debug('StringReplace output: ' + message.content)
        this.emit('message', message)
    }
}

export default StringReplace