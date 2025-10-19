
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
 * Splits text content into an array of lines, filtering empty lines and comments.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`ns.trn.inputField`** - Field containing text to split (default: 'content')
 * * **`ns.trn.outputField`** - Field to store array of lines (default: 'lines')
 * * **`ns.trn.filterEmpty`** - Filter empty lines (default: 'true')
 * * **`ns.trn.filterComments`** - Filter lines starting with comment char (default: 'true')
 * * **`ns.trn.commentChar`** - Comment character (default: '#')
 *
 * #### __*Input*__
 * * **`message[inputField]`** - The text content to be split into lines
 *
 * #### __*Output*__
 * * **`message[outputField]`** - Array of filtered lines
 *
 * #### __*Behavior*__
 * * Splits input text by newline character
 * * Trims whitespace from each line
 * * Optionally filters empty lines (default: yes)
 * * Optionally filters comment lines (default: yes)
 * * Stores result as array in output field
 *
 * #### __*Side Effects*__
 * * Adds array field to message object
 */
class LineReader extends Processor {

    constructor(config) {
        super(config)
    }

    async process(message) {
        logger.debug('\nLineReader.process')

        // Get configuration
        const inputField = super.getProperty(ns.trn.inputField, 'content')
        const outputField = super.getProperty(ns.trn.outputField, 'lines')
        const filterEmpty = super.getProperty(ns.trn.filterEmpty, 'true') === 'true'
        const filterComments = super.getProperty(ns.trn.filterComments, 'true') === 'true'
        const commentChar = super.getProperty(ns.trn.commentChar, '#')

        // Get text content
        const text = message[inputField]
        if (!text) {
            logger.warn(`LineReader: No content found in message.${inputField}`)
            return this.emit('message', message)
        }

        // Split into lines
        const allLines = text.toString().split('\n')

        // Filter lines
        const lines = allLines
            .map(line => line.trim())
            .filter(line => {
                if (filterEmpty && !line) return false
                if (filterComments && line.startsWith(commentChar)) return false
                return true
            })

        logger.debug(`LineReader: Split ${allLines.length} lines, filtered to ${lines.length}`)

        // Store in output field
        message[outputField] = lines

        return this.emit('message', message)
    }
}

export default LineReader