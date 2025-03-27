import logger from '../../utils/Logger.js'
import EnvLoader from '../../processors/system/EnvLoader.js'
import WhiteboardToMessage from '../../processors/util/WhiteboardToMessage.js'

logger.log('EnvLoader simple')

const config = { whiteboard: [] }

const p10 = new EnvLoader(config)
p10.id = 'http://purls.org/stuff/#p10'

const p20 = new WhiteboardToMessage(config)
p10.id = 'http://purls.org/stuff/#p20'

var message = {
    "workingDir": "src/applications/env-loader-test/data",
    "rootDir": "[no key]",
    "tags": "SM"
}

const x = 3

message = await p10.process(message)

logger.log('p10 output ' + p10.getTag() + message)

message = await p20.process(message)

logger.log('p20 output ')

logger.reveal(message)