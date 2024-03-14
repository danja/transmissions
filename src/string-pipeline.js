// import { promisify } from 'util'

import logger from './utils/Logger.js'
import { Reveal } from './utils/Reveal.js'

import Transmission from './mill/Transmission.js';
import TransmissionBuilder from './mill/TransmissionBuilder.js'

logger.setLogLevel("info")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())

const transmissionConfigFile = 'transmissions/string-pipeline_transmission.ttl'
const servicesConfigFile = 'transmissions/string-pipeline_services.ttl' // not used

const transmission = await TransmissionBuilder.build(transmissionConfigFile, servicesConfigFile)

transmission.execute("Hello")

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