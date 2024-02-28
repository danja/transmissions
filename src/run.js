import { promisify } from 'util'

import logger from './utils/Logger.js'
import { Reveal } from './utils/Reveal.js'


// import simplepipe from './simplepipe.json' assert { type: 'json' };
import Transmission from './mill/Transmission.js';
import TransmissionBuilder from './mill/TransmissionBuilder.js'
// import { Executor } from './mill/Executor.js';
logger.setLogLevel("info")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())
const transDefn = 'transmissions/string-pipe.ttl'


const config = {
    "inputString": "Hello"
}

const transmission = await TransmissionBuilder.build(transDefn)

transmission.execute(config)

/*
const config = {
    "inputFilePath": "./input.txt",
    "outputFilePath": "./output.txt"
}
*/
/*
stringPipe.execute = promisify(stringPipe.execute)

    (async () => {
        try {
            const result = await stringPipe.execute(simplePipe);
            console.log('Pipeline result:', result);
        } catch (error) {
            console.error('Error executing pipeline:', error);
        }
    })()
    */