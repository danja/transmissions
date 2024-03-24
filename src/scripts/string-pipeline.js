import path from 'path'
import { fileURLToPath } from 'url'

import logger from '../utils/Logger.js'

import TransmissionBuilder from '../mill/TransmissionBuilder.js'

logger.setLogLevel("debug")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../')

const transmissionConfigFile = path.join(rootDir, 'transmissions/string-pipeline_transmission.ttl');
const servicesConfigFile = path.join(rootDir, 'transmissions/string-pipeline_services.ttl');

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