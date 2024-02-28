

import logger from './utils/Logger.js'
import { Reveal } from './utils/Reveal.js'

import Transmission from './mill/Transmission.js';
import TransmissionBuilder from './mill/TransmissionBuilder.js'
// import { Executor } from './mill/Executor.js';
logger.setLogLevel("info")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())

const transDefn = 'transmissions/file-pipeline.ttl'
const transmission = await TransmissionBuilder.build(transDefn) // accept filename or dataset..?

const configFile = 'transmissions/file-pipeline-config.ttl'
const config = await TransmissionBuilder.readDataset(configFile)


transmission.execute(config)
