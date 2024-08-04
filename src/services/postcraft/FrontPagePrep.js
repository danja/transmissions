// src/services/postcraft/FrontPagePrep.js

import logger from '../../utils/Logger.js'
import ProcessService from '../base/ProcessService.js'
import { readFile } from 'node:fs/promises'

class FrontPagePrep extends ProcessService {
  constructor(config) {
    super(config)
  }

  async execute(message) {
    try {
      message.templateFilename = message.rootDir + '/' + message.indexPage.templateFilename
      logger.debug('Template = ' + message.templateFilename)

      const rawEntryPaths = this.resolveRawEntryPaths(message)
      message.content = ''

      const entryCount = Math.min(5, rawEntryPaths.length) // Limit to 5 entries or less

      for (let i = 0; i < entryCount; i++) {
        const rawEntryPath = rawEntryPaths[i]
        if (rawEntryPath) {
          message.content += await readFile(rawEntryPath, 'utf8')
        } else {
          logger.warn(`Skipping undefined entry path at index ${i}`)
        }
      }

      message.contentBlocks.content = message.content
      message.filepath = message.rootDir + '/' + message.indexPage.filepath

      this.emit('message', message)
    } catch (err) {
      logger.error('Error in FrontPagePrep')
      logger.error(err)
    }
  }

  resolveRawEntryPaths(message) {
    const paths = []
    const slugs = message.slugs || []
    const entryCount = slugs.length

    for (let i = 0; i < entryCount; i++) {
      const slug = slugs[i]
      if (slug) {
        const path = message.rootDir + '/' + message.entryContentMeta.targetDir + '/' + slug + '.html'
        paths.push(path)
      }
    }

    return paths
  }
}

export default FrontPagePrep