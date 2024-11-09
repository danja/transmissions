// src/applications/test_restructure/simple.js

import FileReader from '../../processors/fs/FileReader.js'
import Restructure from '../../processors/json/Restructure.js'
import FileWriter from '../../processors/fs/FileWriter.js'

const config = {
    "simples": "true",
    "sourceFile": "input/input-01.json",
    "destinationFile": "output/output-01.json",
    "mediaType": "application/json",
    "rename": [{
        "pre": "content.item.chat_messages",
        "post": "channel"
    }, {
        "pre": "content.item.uuid",
        "post": "filename"
    }, {
        "pre": "content.item.name",
        "post": "title"
    }]
}

var message = { "dataDir": "src/applications/test_restructure/data" }

const read = new FileReader(config)
message = await read.process(message)

const restructure = new Restructure(config)
message = await restructure.process(message)

const write = new FileWriter(config)
await write.process(message)