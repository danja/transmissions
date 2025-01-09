import logger from '../../utils/Logger.js'
// import EnvLoader from '../../processors/system/EnvLoader.js'
// import WhiteboardToMessage from '../../processors/util/WhiteboardToMessage.js'
import NOP from '../../processors/flow/NOP.js'
logger.log('NOP simple')

const config = {
    "runmode": "functions",
    whiteboard: []
}

const p10 = new NOP(config)
p10.id = 'http://purls.org/stuff/#p10'


var message = {
    "test": "test string",
    "dataDir": "src/applications/env-loader-test/data",
    "rootDir": "[no key]",
    "tags": "SM"
}




message = await p10.process(message)

logger.log('p10 output ' + message)

// message = await p20.process(message)
// logger.log('p20 output ' + message)