import { promisify } from 'util'

import logger from './utils/Logger.js'
import { Reveal } from './utils/Reveal.js'


// import simplepipe from './simplepipe.json' assert { type: 'json' };
import Transmission from './mill/Transmission.js';
import TransmissionBuilder from './mill/TransmissionBuilder.js'
// import { Executor } from './mill/Executor.js';
logger.setLogLevel("info")
logger.log("Hello, logger!")
logger.log("process.cwd() = " + process.cwd())
const transmissionFile = 'transmissions/string-pipe.ttl'

// const transmissionFile = 'src/transmissions/string-pipe.ttl'
// 
// const inputFilePath = './input.txt';
// const outputFilePath = './output.txt';

const stringPipe = TransmissionBuilder.build(transmissionFile)

stringPipe.execute = promisify(stringPipe.execute)

    (async () => {
        try {
            const result = await stringPipe.execute(simplePipe);
            console.log('Pipeline result:', result);
        } catch (error) {
            console.error('Error executing pipeline:', error);
        }
    })()