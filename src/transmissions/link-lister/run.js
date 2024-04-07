import footpath from '../../utils/footpath.js'

import logger from '../../utils/Logger.js'
import TransmissionBuilder from '../../mill/TransmissionBuilder.js'

logger.setLogLevel("debug")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())

const transmissionConfigFile = 'transmission.ttl'
const servicesConfigFile = 'services.ttl'

const tcf = footpath.resolve(import.meta.url, './', transmissionConfigFile)
const scf = footpath.resolve(import.meta.url, './', servicesConfigFile)

const transmission = await TransmissionBuilder.build(tcf, scf)

// const runPath = process.cwd()
const here = import.meta.url
const context = { runScript: here }

transmission.execute('', context)
