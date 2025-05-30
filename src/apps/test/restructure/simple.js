// src/apps/test_restructure/simple.js

import AppManager from '../../../engine/AppManager.js'
import logger from '../../../utils/Logger.js'
import FileReader from '../../../processors/fs/FileReader.js'
import Restructure from '../../../processors/json/Restructure.js'
import FileWriter from '../../../processors/fs/FileWriter.js'

logger.setLogLevel('debug')

const config = {
    "simples": "true",
    "workingDir": "src/apps/test/restructure/data",
    "sourceFile": "input/input-01.json",
    "destinationFile": "output/output-01.json",
    "mediaType": "application/json",
    "rename": [{
        "pre": "content.item.chat_messages",
        "post": "content.channel"
    }, {
        "pre": "content.item.uuid",
        "post": "content.filename"
    }, {
        "pre": "content.item.name",
        "post": "content.title"
    }]
}

const app = AppManager.simpleApp(config)

var message = {

}

const read = new FileReader(app)
message = await read.process(message)

const restructure = new Restructure(app)
message = await restructure.process(message)

const write = new FileWriter(app)
await write.process(message)