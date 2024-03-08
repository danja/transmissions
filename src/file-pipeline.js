import logger from './utils/Logger.js'
import { Reveal } from './utils/Reveal.js'

import Transmission from './mill/Transmission.js';
import TransmissionBuilder from './mill/TransmissionBuilder.js'
// import { Executor } from './mill/Executor.js';
logger.setLogLevel("info")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())

const transmissionConfigFile = 'transmissions/file-pipeline-transmission.ttl'
const servicesConfigFile = 'transmissions/file-pipeline-services.ttl'

const transmission = await TransmissionBuilder.build(transmissionConfigFile, servicesConfigFile)

transmission.execute('no data')
