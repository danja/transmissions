// src/processors/text/Escaper.js
/**
 * @class Escaper
 * @extends Processor
 * @classdesc
 * **a Transmissions Processor**
 *
 * Escapes string characters
 *
 * #### __*Input*__
 * * **`message.content`** - default field for input/output
 * * **`message.* `** - input/output field defined in settings
 *
 * #### __*Output*__
 * * **`message.content`** - default field for input/output
 * * **`message.* `** - input/output field defined in settings
 *
 * #### __*Behavior*__
 * * retrieve input field from message
 * * replace characters according to rules determined by format
 * * place output field in message
 *
 * #### __*Settings*__
 * * **`format`** - SPARQL, Turtle... [default : 'SPARQL']
 * * **`inputField`** - field in message to use as input [default : 'content']
 * * **`outputField`** - field in message to use as output
 *
 * #### __*Side Effects*__
 * * none
 *
 * #### __*References*__
 * * tests : TBD
 * * docs : TBD
 *
 * #### __*TODO*__
 * * create code
 * * create tests
 * * create docs
 */



import { readFile } from 'node:fs/promises'
import { access, constants } from 'node:fs'
import path from 'path'
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