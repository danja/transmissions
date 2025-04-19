// nop.js
// node src/simples/nop/nop.js

import NOP from '../../../processors/flow/NOP.js'

const config = {
    "runmode": "functions",
    whiteboard: []
}

const nop = new NOP(config)

var message = { 'value': '42' }

message = await nop.process(message)

console.log('value = ' + message.value)
