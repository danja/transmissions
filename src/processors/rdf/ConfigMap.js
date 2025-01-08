import rdf from 'rdf-ext'
import grapoi from 'grapoi'
import path from 'path'
import ns from '../../utils/ns.js'
import logger from '../../utils/Logger.js'
import Processor from '../base/Processor.js'

class ConfigMap extends Processor {
  constructor(config) {
    super(config)
  }

  async process(message) {
    // logger.setLogLevel('debug')

    /*
     if (!message.dataset) {
       logger.warn('No dataset provided')
       return this.emit('message', message)
     }
 */
    logger.debug(`ConfigMap.process`)
    this.showMyConfig()

    const basePath = message.targetPath || message.rootDir
    logger.debug(`ConfigMap using base path: ${basePath}`)

    const dataset = message.dataset
    const poi = grapoi({ dataset })

    // Find ConfigSet instances
    for (const quad of poi.out(ns.rdf.type, ns.pc.ConfigSet).quads()) {
      const groupID = quad.subject

      let groupName = ns.getShortname(groupID.value)
      //   let type = ns.getShortname(processorType.value)
      logger.debug(`*** groupName = ${groupName} `)
      // *** groupID.value = http://hyperdata.it/transmissions/AtomFeed

      const groupPoi = grapoi({ dataset, term: groupID })

      if (!message.contentGroup) message.contentGroup = {}
      // Extract paths
      if (groupPoi.out(ns.fs.sourceDirectory).term) {
        let sourceDir = this.resolvePath(
          basePath,
          groupPoi.out(ns.fs.sourceDirectory).term.value)

        if (!message.contentGroup[groupName]) message.contentGroup[groupName] = {}
        message.contentGroup[groupName].sourceDir = sourceDir
      }

      if (groupPoi.out(ns.fs.targetDirectory).term) {
        let targetDir = this.resolvePath(
          basePath,
          groupPoi.out(ns.fs.targetDirectory).term.value
        )
        if (!message.contentGroup[groupName]) message.contentGroup[groupName] = {}
        message.contentGroup[groupName].targetDir = targetDir
      }

      if (groupPoi.out(ns.pc.template).term) {
        let templateFile = this.resolvePath(
          basePath,
          groupPoi.out(ns.pc.template).term.value
        )
        if (!message.contentGroup[groupName]) message.contentGroup[groupName] = {}
        message.contentGroup[groupName].templateFile = templateFile
      }

      /*
logger.debug(`Resolved :
  groupName: ${groupName}
  sourceDir: ${sourceDir}
  targetDir: ${targetDir}
  templateFile: ${templateFile}`)


message.contentGroup[groupName] =
{ "sourceDir": sourceDir, "targetDir": targetDir, "templateFile": templateFile }
*/
      //  logger.reveal(message)
    }
    // process.exit()

    return this.emit('message', message)
  }

  resolvePath(basePath, relativePath) {
    if (!basePath || !relativePath) {
      throw new Error('Base path and relative path required')
    }

    const resolved = path.isAbsolute(relativePath)
      ? relativePath
      : path.join(basePath, relativePath)

    return path.normalize(resolved)
  }
}

export default ConfigMap