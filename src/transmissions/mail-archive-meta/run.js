import logger from '../../utils/Logger.js'
import TransmissionBuilder from '../../mill/TransmissionBuilder.js'

logger.setLogLevel("debug")
logger.debug("Hello, logger!")
logger.debug("process.cwd() = " + process.cwd())

const rootDir = process.cwd() + '/../'

const transmissionConfigFile = rootDir + 'transmissions/mail-archive-meta_transmission.ttl'
const servicesConfigFile = rootDir + 'transmissions/file-pipeline_services.ttl' // not used

const transmission = await TransmissionBuilder.build(transmissionConfigFile, servicesConfigFile)

transmission.execute('../../data/mail-archive-sample')
