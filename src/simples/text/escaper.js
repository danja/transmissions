// nop.js
// node src/simples/text/escaper.js

// TODO fix message/config properties

import logger from '../../utils/Logger.js'
import Escaper from '../../processors/text/Escaper.js'

logger.setLogLevel('debug')

var message = {
    "simple": true,
    "format": "dummy",
    "inputField": "content",
    "outputField": "output",
    "content": `'mud' mud
                     muddy`
}

const config = message

const escaper = new Escaper(config)

message = await escaper.process(message)

console.log('Escaped = ' + message.output)
