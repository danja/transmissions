// set-message.js
// node src/simples/set-message/set-message.js 

import logger from '../../utils/Logger.js'
import SetMessage from '../../processors/util/SetMessage.js'

const config = {
    "runmode": "functions",
    whiteboard: []
}

const setm = new SetMessage(config)

var message = { 'value': '42' }

message = await setm.process(message)

logger.log('value = ' + message.value)

logger.reveal(message)
