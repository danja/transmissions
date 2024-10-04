// nop.js
// node src/simples/nop/nop.js 

import NOP from '../../processors/util/NOP.js'

const config = {
    "runmode": "functions",
    whiteboard: []
}

const nop = new NOP(config)

var message = { 'value': '42' }

message = await nop.execute(message)

console.log('value = ' + message.value)
