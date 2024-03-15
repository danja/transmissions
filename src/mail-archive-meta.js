import logger from './utils/Logger.js'
import { Reveal } from './utils/Reveal.js'

import Transmission from './mill/Transmission.js';
import TransmissionBuilder from './mill/TransmissionBuilder.js'
logger.setLogLevel("debug")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())

const transmissionConfigFile = 'transmissions/mail-archive-meta_transmission.ttl'
const servicesConfigFile = 'transmissions/file-pipeline_services.ttl' // not used

const transmission = await TransmissionBuilder.build(transmissionConfigFile, servicesConfigFile)

transmission.execute('../data/mail-archive-sample')
