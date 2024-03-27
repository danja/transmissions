import footpath from '../utils/footpath.js'

import logger from '../utils/Logger.js'
import TransmissionBuilder from '../mill/TransmissionBuilder.js'

logger.setLogLevel("debug")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())

const transmissionConfigFile = 'transmissions/link-lister_transmission.ttl'
const servicesConfigFile = 'transmissions/file-pipeline_services.ttl'

const tcf = footpath.resolve(import.meta.url, '../', transmissionConfigFile)
const scf = footpath.resolve(import.meta.url, '../', servicesConfigFile)

const transmission = await TransmissionBuilder.build(tcf, scf)

const linkFile = 'data/starter-links.md'
// const lf = footpath.resolve(import.meta.url, '../../', linkFile)

const context = { filename: linkFile }
transmission.execute('', context)
