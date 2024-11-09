// src/applications/test_fs-rw/simple.js

import FileReader from '../../processors/fs/FileReader.js'
import FileWriter from '../../processors/fs/FileWriter.js'

const config = {
    "simples": "true",
    "sourceFile": "input/input-01.md",
    "destinationFile": "output/output-01.md"
}

var message = { "dataDir": "src/applications/test_fs-rw/data" }

const read = new FileReader(config)

message = await read.process(message)

const write = new FileWriter(config)

message = await write.process(message)

