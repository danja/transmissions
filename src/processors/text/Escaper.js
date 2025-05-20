// src/processors/text/Escaper.js
/**
 * @class Escaper
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Escapes special characters in strings for specific formats (e.g., SPARQL, Turtle) by replacing them according to configurable rules.
 *
 * ### Processor Signature
 *
 * #### __*Settings*__
 * * **`format`** - Target format for escaping (e.g., 'SPARQL', 'Turtle'). Default: 'SPARQL'.
 * * **`inputField`** - Field in message to use as input. Default: 'content'.
 * * **`outputField`** - Field in message to use as output. Optional.
 *
 * #### __*Input*__
 * * **`message.content`** - Default field for input/output
 * * **`message.*`** - Input/output field defined in settings
 *
 * #### __*Output*__
 * * **`message.content`** - Default field for input/output
 * * **`message.*`** - Input/output field defined in settings
 *
 * #### __*Behavior*__
 * * Retrieves the input field from the message
 * * Replaces characters according to rules determined by the specified format
 * * Places the escaped output in the configured output field
 *
 * #### __*Side Effects*__
 * * None (all changes are in-memory or in the emitted message)
 *
 * #### __*ToDo*__
 * Implement additional format rules
 * Add comprehensive tests and documentation
 */


import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'

class Escaper extends Processor {
    constructor(config) {
        super(config)
    }

    /**
      * Does something with the message and emits a 'message' event with the processed message.
      * @param {Object} message - The message object.
      */
    async process(message) {
        logger.debug(`\n\nEscaper.process`)

        // TODO figure this out better
        // may be needed if preceded by a spawning processor, eg. fs/DirWalker
        if (message.done) {
            return this.emit('message', message)
        }

        // load settings
        const format = await this.getProperty(ns.trn.format, 'SPARQL')
        const inputField = await this.getProperty(ns.trn.inputField, 'content')
        const outputField = await this.getProperty(ns.trn.outputField, 'content')
        //if (!message[outputField]) message.outputField = ''

        logger.debug(`
            format = ${format}
            inputField = ${inputField}
            outputField = ${outputField}`)
        var string = message[inputField]
        // const string
        const replacements = this.getReplacementList(format)
        string = this.escape(string, replacements)
        message[outputField] = string

        // message forwarded
        return this.emit('message', message)
    }

    escape(string, replacements) {
        for (var i = 0; i < replacements.length; i++) {
            logger.debug(`string = ${string}
                ${replacements[i][0]} => ${replacements[i][1]}
          `)
            string = string.replace(replacements[i][0], replacements[i][1])
        }
        return string
    }

    getReplacementList(format) {
        switch (format) {
            case 'dummy':
                return [
                    [/d/g, 'm'],
                    [/m/g, 'd']
                ]
            case 'SPARQL':
                return [
                    [/\\/g, '\\\\'],
                    [/"/g, '\\"'],
                    [/'/g, "\\'"]
                ]
            default:
                return []
        }
    }

}
export default Escaper