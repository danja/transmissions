// src/processors/flow/Choice.js

import logger from '../../utils/Logger.js'
import ns from '../../utils/ns.js'
import Processor from '../../model/Processor.js'
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
class Choice extends Processor {
    constructor(config) {
        super(config)
    }

    /**
      * Does something with the message and emits a 'message' event with the processed message.
      * @param {Object} message - The message object.
      */
    async process(message) {
        logger.debug(`\n\nChoice.process`)

        // TODO figure this out better
        // may be needed if preceded by a spawning processor, eg. fs/DirWalker
        if (message.done) {
            return this.emit('message', message)
            // or simply return
        }

        // message is processed here :

        // property values pulled from message | config settings | fallback
        const me = await this.getProperty(ns.trn.me)
        logger.log(`\nI am ${me}`)

        message.common = await this.getProperty(ns.trn.common)
        message.something1 = await this.getProperty(ns.trn.something1)

        message.something2 = await this.getProperty(ns.trn.something2)

        var added = await this.getProperty(ns.trn.added, '')
        message.something1 = message.something1 + added

        message.notavalue = await this.getProperty(ns.trn.notavalue, 'fallback value')

        // message forwarded
        return this.emit('message', message)
    }
}
export default Choice