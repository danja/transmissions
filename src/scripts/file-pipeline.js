import path from 'path'
import { fileURLToPath } from 'url'

import logger from '../utils/Logger.js'
import TransmissionBuilder from '../mill/TransmissionBuilder.js'

logger.setLogLevel("debug")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())

console.log("process.cwd() = " + process.cwd())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '../'); //

const transmissionConfigFile = path.join(rootDir, 'transmissions/file-pipeline_transmission.ttl');
const servicesConfigFile = path.join(rootDir, 'transmissions/file-pipeline_services.ttl');

const transmission = await TransmissionBuilder.build(transmissionConfigFile, servicesConfigFile)

transmission.execute('no data')
