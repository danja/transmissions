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
    if (!message.dataset) {
      logger.warn('No dataset provided')
      return this.emit('message', message)
    }

    const basePath = message.targetPath || message.rootDir
    logger.debug(`ConfigMap using base path: ${basePath}`)

    const dataset = message.dataset
    const poi = grapoi({ dataset })

    // Find ContentGroup instances
    for (const quad of poi.out(ns.rdf.type, ns.pc.ContentGroup).quads()) {
      const groupId = quad.subject
      const groupPoi = grapoi({ dataset, term: groupId })

      // Extract paths
      if (groupPoi.out(ns.fs.sourceDirectory).term) {
        message.sourceDir = this.resolvePath(
          basePath,
          groupPoi.out(ns.fs.sourceDirectory).term.value
        )
      }

      if (groupPoi.out(ns.fs.targetDirectory).term) {
        message.targetDir = this.resolvePath(
          basePath,
          groupPoi.out(ns.fs.targetDirectory).term.value
        )
      }

      if (groupPoi.out(ns.pc.template).term) {
        message.filepath = this.resolvePath(
          basePath,
          groupPoi.out(ns.pc.template).term.value
        )
      }

      logger.debug(`Resolved paths:
        sourceDir: ${message.sourceDir}
        targetDir: ${message.targetDir}
        filepath: ${message.filepath}`)
    }

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