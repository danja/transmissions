// src/processors/text/StringReplace.js
/**
 * @class StringReplace
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
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

import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class StringReplace extends Processor {
    constructor(config) {
        super(config)
    }

    /**
     * Executes the string replacement process
     * @param {Object} message - The message object containing content, match, and replace strings
     */
    async process(message) {
        // logger.setLogLevel('debug')
        const inputField = this.getProperty(ns.trn.inputField)
        const outputField = this.getProperty(ns.trn.outputField)

        var match = message.match ? message.match : this.getProperty(ns.trn.match)
        var replace = message.replace ? message.replace : this.getProperty(ns.trn.replace)

        var input = message.input ? message.input : message[inputField]
        if (!input) {
            input = message.content
        }

        logger.debug('StringReplace.process input = ' + input)

        // global s & r
        const output = input.split(match).join(replace)

        logger.debug('StringReplace output: ' + output)
        try {
            message[outputField] = output
        } catch {
            message.content = output
        }
        return this.emit('message', message)
    }
}

export default StringReplace