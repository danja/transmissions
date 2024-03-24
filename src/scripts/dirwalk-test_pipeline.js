import footpath from '../utils/footpath.js'
import logger from '../utils/Logger.js'

import TransmissionBuilder from '../mill/TransmissionBuilder.js'

logger.setLogLevel("debug")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())

const transmissionConfigFile = 'transmissions/dirwalker-test_transmission.ttl'
const servicesConfigFile = 'transmissions/file-pipeline_services.ttl' // not used

const tcf = footpath.resolve(import.meta.url, '../', transmissionConfigFile)
const scf = footpath.resolve(import.meta.url, '../', servicesConfigFile)

logger.debug('tcf = ' + tcf)

const transmission = await TransmissionBuilder.build(tcf, scf)

transmission.execute('../../data/mail-archive-sample')

