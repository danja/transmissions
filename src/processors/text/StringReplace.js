// src/processors/text/StringReplace.js
/**
 * @class StringReplace
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Performs string replacement operations on message content or specified fields.
 *
 * ### Service Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.match`** - The substring to be replaced (can be overridden by message.match)
 * * **`ns.trn.replace`** - The replacement string (can be overridden by message.replace)
 * * **`ns.trn.inputField`** - (optional) Field containing the input string (defaults to 'content')
 * * **`ns.trn.outputField`** - (optional) Field to store the result (defaults to 'content')
 *
 * #### __*Input*__
 * * **`message.content`** - The input string if no inputField is specified
 * * **`message.match`** - (optional) Overrides the configured match string
 * * **`message.replace`** - (optional) Overrides the configured replacement string
 * * **`message[inputField]`** - The input string if inputField is specified
 *
 * #### __*Output*__
 * * **`message[outputField]`** - The modified string with all replacements made
 * * **`message.content`** - The modified string if outputField is not specified
 *
 * #### __*Behavior*__
 * * Replaces all occurrences of the match string with the replacement string
 * * If no match is found, the input remains unchanged
 * * Supports both global and instance-level configuration
 * * Falls back to message.content if no input field is specified
 *
 * #### __*Side Effects*__
 * * Modifies the message object by adding/updating the output field
 *
 * #### __*Tests*__
 * * TODO: Add test information
 *
 * #### __*ToDo*__
 * * Add test cases for edge cases
 * * Add support for regular expressions
 */

import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

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
        const inputField = super.getProperty(ns.trn.inputField)
        const outputField = super.getProperty(ns.trn.outputField)

        var match = message.match ? message.match : super.getProperty(ns.trn.match)
        var replace = message.replace ? message.replace : super.getProperty(ns.trn.replace)

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