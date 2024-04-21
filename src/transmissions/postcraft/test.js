import footpath from '../../utils/footpath.js'
import logger from '../../utils/Logger.js'

import TransmissionBuilder from '../../mill/TransmissionBuilder.js'

logger.setLogLevel("debug")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())

const transmissionConfigFile = 'transmission.ttl'
const servicesConfigFile = 'services.ttl' // not used

const tcf = footpath.resolve(import.meta.url, './', transmissionConfigFile)
const scf = footpath.resolve(import.meta.url, './', servicesConfigFile)

logger.debug('tcf = ' + tcf)

const transmission = await TransmissionBuilder.build(tcf, scf)

logger.log('DESCRIBE ' + await transmission.describe())

// transmission.execute('/home/danny/HKMS/postcraft/danny.ayers.name/manifest.ttl', {})

