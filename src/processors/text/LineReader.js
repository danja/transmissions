
import { readFile } from 'node:fs/promises'
import grapoi from 'grapoi'
import ns from '../../utils/ns.js'
import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'
import Processor from '../../model/Processor.js'

// src/processors/text/LineReader.js
/**
 * @class LineReader
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Reads a text file or string, splits it into lines, and emits each non-empty, non-comment line as a separate message for downstream processing.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * None specific; inherits from base Processor
 *
 * #### __*Input*__
 * * **`message.content`** - The text content to be split into lines
 * * **`message.filepath`** (optional) - Path to the file to be read (if not using `message.content`)
 *
 * #### __*Output*__
 * * Emits each line (string) as a separate message, together with the original message context
 *
 * #### __*Behavior*__
 * * Splits input text into lines
 * * Ignores empty lines and lines starting with '#'
 * * Emits each valid line as a new message
 *
 * #### __*Side Effects*__
 * * None (all changes are in-memory or in emitted messages)
 *
 * #### __*ToDo*__
 * Add support for reading from file if filepath is provided
 * Add configurable comment character and line filtering
 */
class LineReader extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {

        const text = data.toString()


        const lines = text.split('\n')
        for await (let line of lines) {
            if (line.trim() && !line.startsWith('#')) {
                logger.debug('Line = [[[' + line + ']]]')
                return this.emit('message', line, message)
            }
        }

        return this.emit('message', '~~done~~', message)
    }
}

export default LineReader