// src/applications/test_restructure/simple.js

import FileReader from '../../processors/fs/FileReader.js'
import Restructure from '../../processors/json/Restructure.js'
import FileWriter from '../../processors/fs/FileReader.js'

const config = {
    "runmode": "functions",
    whiteboard: []
}

const nop = new NOP(config)

var message = { 'value': '42' }

message = await nop.process(message)

console.log('value = ' + message.value)
